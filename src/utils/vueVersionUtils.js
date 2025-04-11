/**
 * Vue 版本兼容性工具
 * 用于解决Vue2和Vue3之间的API和语法差异
 */

import { version } from 'vue'

// 检测Vue版本
export const isVue3 = () => version.startsWith('3')
export const isVue2 = () => version.startsWith('2')

/**
 * 创建与版本兼容的v-model指令绑定
 * @param {Object} props 组件props
 * @param {String} prop 需要绑定的属性名
 * @param {Function} emit 组件的emit函数
 * @returns {Object} v-model绑定对象
 */
export const createVModelBinding = (props, prop = 'modelValue', emit) => {
  const propName = isVue3() ? prop : 'value'
  return {
    get: () => props[propName],
    set: (value) => {
      if (isVue3()) {
        emit(`update:${prop}`, value)
      } else {
        emit('input', value)
      }
    }
  }
}

/**
 * 创建受控组件的props定义
 * @param {Object} propsDef 基础props定义
 * @returns {Object} 增强后的props定义
 */
export const createCompatProps = (propsDef = {}) => {
  // Vue3使用modelValue, Vue2使用value
  const modelPropName = isVue3() ? 'modelValue' : 'value'
  return {
    ...propsDef,
    [modelPropName]: {
      type: [String, Number, Boolean, Object, Array],
      default: null
    }
  }
}

/**
 * 应用占位符修复
 * 解决输入框中占位符与内容重叠问题
 * @param {Object} loginForm - 登录表单数据对象
 * @param {Object} registerForm - 注册表单数据对象
 */
export function applyPlaceholderFix(loginForm, registerForm) {
  setTimeout(() => {
    // 1. 监听所有输入框的状态变化
    const inputs = document.querySelectorAll('.ant-input, .ant-input-password input');
    
    inputs.forEach(input => {
      // 初始化检查
      updateInputState(input);
      
      // 添加事件监听器
      input.addEventListener('input', function() {
        updateInputState(this);
        
        // 同步到Vue响应式数据
        syncToVueData(input, loginForm, registerForm);
      });
      
      input.addEventListener('focus', function() {
        const wrapper = this.closest('.ant-input-affix-wrapper') || this.parentNode;
        if (wrapper) {
          wrapper.classList.add('focused');
        }
      });
      
      input.addEventListener('blur', function() {
        const wrapper = this.closest('.ant-input-affix-wrapper') || this.parentNode;
        if (wrapper) {
          wrapper.classList.remove('focused');
          updateInputState(this);
          
          // 同步到Vue响应式数据
          syncToVueData(input, loginForm, registerForm);
        }
      });
    });
    
    // 2. 为所有表单添加提交拦截
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (!form.getAttribute('data-intercepted')) {
        form.setAttribute('data-intercepted', 'true');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // 提交前强制同步所有输入框值到Vue
          const formInputs = form.querySelectorAll('input');
          formInputs.forEach(input => {
            updateInputState(input);
            syncToVueData(input, loginForm, registerForm);
          });
        });
      }
    });
    
    // 3. 为按钮添加点击处理
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('data-intercepted')) {
        button.setAttribute('data-intercepted', 'true');
        button.addEventListener('click', () => {
          // 按钮点击时强制同步所有输入框值到Vue
          document.querySelectorAll('input').forEach(input => {
            updateInputState(input);
            syncToVueData(input, loginForm, registerForm);
          });
        });
      }
    });
    
    // 4. 为复选框添加状态同步
    const checkboxes = document.querySelectorAll('.ant-checkbox-input');
    checkboxes.forEach(checkbox => {
      if (!checkbox.getAttribute('data-intercepted')) {
        checkbox.setAttribute('data-intercepted', 'true');
        checkbox.addEventListener('change', function() {
          // 触发事件通知Vue
          this.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
    });
  }, 300);
}

/**
 * 更新输入框状态
 * @param {HTMLElement} input - 输入框元素
 */
function updateInputState(input) {
  if (!input) return;
  
  // 获取最外层包装元素
  const wrapper = input.closest('.ant-input-affix-wrapper') || 
                  input.closest('.custom-input') || 
                  input.parentNode;
  
  if (wrapper) {
    // 根据输入框内容设置状态类
    if (input.value && input.value.trim()) {
      wrapper.classList.add('has-value');
      input.classList.add('not-empty');
      
      // 对于密码框特殊处理
      if (input.type === 'password') {
        const passwordWrapper = input.closest('.ant-input-password');
        if (passwordWrapper) {
          passwordWrapper.classList.add('has-value');
        }
      }
    } else {
      wrapper.classList.remove('has-value');
      input.classList.remove('not-empty');
      
      // 对于密码框特殊处理
      if (input.type === 'password') {
        const passwordWrapper = input.closest('.ant-input-password');
        if (passwordWrapper) {
          passwordWrapper.classList.remove('has-value');
        }
      }
    }
  }
}

/**
 * 同步输入框值到Vue响应式数据
 * @param {HTMLElement} input - 输入框元素
 * @param {Object} loginForm - 登录表单数据
 * @param {Object} registerForm - 注册表单数据
 */
function syncToVueData(input, loginForm, registerForm) {
  // 只处理有ID的输入框
  if (!input.id) return;
  
  const id = input.id;
  const value = input.value;
  
  // 根据ID判断输入框类型并同步相应数据
  if (id === 'inputUsername' && loginForm) {
    loginForm.username = value;
  } else if (id === 'inputPassword' && loginForm) {
    loginForm.password = value;
  } else if (id === 'registerUsername' && registerForm) {
    registerForm.username = value;
  } else if (id === 'registerPhone' && registerForm) {
    registerForm.phone = value;
  } else if (id === 'registerCaptcha' && registerForm) {
    registerForm.captcha = value;
  } else if (id === 'registerPassword' && registerForm) {
    registerForm.password = value;
  } else if (id === 'registerConfirmPassword' && registerForm) {
    registerForm.confirmPassword = value;
  }
}

/**
 * 解决Form表单的版本差异
 * @param {Object} form 表单实例
 * @returns {Object} 增强的表单实例
 */
export const createCompatForm = (form) => {
  if (isVue3()) {
    return form
  }
  
  // Vue2的表单API兼容层
  return {
    ...form,
    validate: (...args) => form.validate(...args),
    validateFields: (...args) => form.validateFields(...args),
    resetFields: (...args) => form.resetFields(...args),
    clearValidate: (...args) => form.clearValidate ? form.clearValidate(...args) : null
  }
}

// 导出默认对象
export default {
  isVue3,
  isVue2,
  createVModelBinding,
  createCompatProps,
  applyPlaceholderFix,
  createCompatForm
} 