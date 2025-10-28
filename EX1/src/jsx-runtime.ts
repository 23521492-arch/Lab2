// Interface đại diện cho node ảo
export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

export interface ComponentProps {
  children?: (VNode | string | number)[];
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode;

export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  
  // BƯỚC 1: Xử lý props và children
  const finalProps = props || {};
  const flatChildren = children
    .flat()
    .filter(c => c !== null && c !== undefined && typeof c !== 'boolean');

  // ************ THIẾU BƯỚC NÀY ************
  // Gán children vào props để component functions có thể truy cập qua props.children
  finalProps.children = flatChildren; 

  return { 
    type, 
    props: finalProps, // Trả về props đã có children
    children: flatChildren // Giữ lại children riêng cho DOM rendering
  };
}

// Hàm xử lý JSX Fragment
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  return createElement('fragment', props, ...children);
}

// Hàm chuyển VNode thành DOM thật
export function renderToDOM(vnode: VNode | string | number): Node {
  
  // Trường hợp primitive
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // Trường hợp component function
  if (typeof vnode.type === 'function') {
    const rendered = vnode.type(vnode.props);
    return renderToDOM(rendered);
  }

  // Trường hợp fragment
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => {
      fragment.appendChild(renderToDOM(child));
    });
    return fragment;
  }

  // Trường hợp thẻ HTML/SVG thông thường
  const SVG_TAGS = new Set([
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'polyline', 'polygon', 'line', 'text', 'defs', 'use', 'clipPath'
  ]);
  const isSvg = typeof vnode.type === 'string' && SVG_TAGS.has(vnode.type);
  const el = isSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.type as string)
    : document.createElement(vnode.type as string);

  const propsObj = vnode.props || {};
  for (const [key, value] of Object.entries(propsObj)) {
    if (key === 'children') {
            continue; 
        }
    if (key === 'ref' && typeof value === 'object' && value !== null && 'current' in value) {
        // Trường hợp đối tượng Ref: Gán element vào ref.current
        (value as { current: HTMLElement | null }).current = el as HTMLElement;
        continue;
    } else if (key === 'ref' && typeof value === 'function') {
        // Trường hợp Ref Callback: Gọi hàm với element DOM
        value(el); 
        continue;
    }
    if (key === 'className' && typeof value === 'string') {
      (el as HTMLElement).className = value;
    } else if (key === 'style') {
      if (value && typeof value === 'object') {
        for (const [styleKey, styleValue] of Object.entries(value)) {
          try {
            // Ưu tiên đặt trực tiếp thuộc tính camelCase (backgroundColor, width, height, ...)
            if (styleKey in el.style) {
              (el.style as any)[styleKey] = String(styleValue);
            } else {
              // Fallback đổi camelCase -> kebab-case cho setProperty
              const cssKey = styleKey.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
              el.style.setProperty(cssKey, String(styleValue));
            }
          } catch {
            const cssKey = styleKey.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
            el.style.setProperty(cssKey, String(styleValue));
          }
        }
      } else if (typeof value === 'string') {
        el.setAttribute('style', value);
      }
  } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
    } else {
      // Xử lý thuộc tính chung, bao gồm boolean attributes (disabled, checked, etc.)
      if (typeof value === 'boolean') {
        if (value) {
          el.setAttribute(key, ''); // boolean attribute: hiện diện là true
        } else {
          // false: không set attribute
        }
      } else if (value !== null && value !== undefined) {
        el.setAttribute(key, String(value));
      }
    }
  }

  vnode.children.forEach(child => {
    el.appendChild(renderToDOM(child));
  });

  return el;
}


// Hàm gắn DOM vào container
// src/jsx-runtime.ts
let GLOBAL_STATE_ARRAY: any[] = [];
let HOOK_INDEX = 0;
let rootContainer: HTMLElement | null = null;
let rootVNode: VNode | null = null;

// Hàm nội bộ để kích hoạt việc render lại toàn bộ ứng dụng
function reRender() {
    if (rootContainer && rootVNode) {
        // RẤT QUAN TRỌNG: Reset chỉ số mỗi lần render lại
        HOOK_INDEX = 0; 
        
        rootContainer.innerHTML = ''; 
        rootContainer.appendChild(renderToDOM(rootVNode));
    }
}

// Sửa đổi hàm useState
let GLOBAL_STATE_VALUE: any = null;
let INITIAL_VALUE: any = null; 

// ... (các hàm reRender, mount, renderToDOM giữ nguyên)

// HÀM QUẢN LÝ STATE MỚI
export function useState<T>(initialValue: T): [() => T, (newValue: T) => void] {
    // Lưu trữ chỉ số state hiện tại
    const stateIndex = HOOK_INDEX;
    
    // 1. Khởi tạo giá trị state (chỉ lần đầu)
    if (GLOBAL_STATE_ARRAY[stateIndex] === undefined) {
        GLOBAL_STATE_ARRAY[stateIndex] = initialValue;
    }
    
    // 2. Tăng chỉ số cho hook tiếp theo
    HOOK_INDEX++; 

    // 3. Hàm getter
    const get = () => GLOBAL_STATE_ARRAY[stateIndex] as T;
    
    // 4. Hàm setter
    const set = (newValue: T) => {
        // Chỉ cập nhật giá trị nếu nó khác giá trị cũ (tối ưu nhẹ)
        if (GLOBAL_STATE_ARRAY[stateIndex] !== newValue) {
            GLOBAL_STATE_ARRAY[stateIndex] = newValue;
            reRender();
        }
    };
    
    return [get, set];
}

// Sửa đổi hàm mount
export function mount(vnode: VNode, container: HTMLElement): void {
    rootContainer = container;
    rootVNode = vnode; 
    container.innerHTML = '';
    container.appendChild(renderToDOM(vnode));
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Khai báo biến toàn cục mới để lưu trữ Refs Array (nếu bạn chưa dùng chung với state)
// Nếu bạn dùng chung GLOBAL_STATE_ARRAY, chỉ cần tạo hàm useRef
export function useRef<T>(initialValue: T): { current: T } {
    const refIndex = HOOK_INDEX;

    // Kiểm tra xem đã có ref ở vị trí này chưa
    if (GLOBAL_STATE_ARRAY[refIndex] === undefined) {
        GLOBAL_STATE_ARRAY[refIndex] = { current: initialValue };
    }

    HOOK_INDEX++; 
    return GLOBAL_STATE_ARRAY[refIndex] as { current: T };
}

