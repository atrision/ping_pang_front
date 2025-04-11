<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h1>乒乓球运动分析系统</h1>
      </div>
      
      <a-card class="login-card">
        <a-tabs v-model="activeKey">
          <a-tab-pane key="login" tab="登录">
            <a-form
              :model="loginForm"
              @submit.prevent="handleLogin"
              :rules="loginRules"
              :validate-trigger="['change', 'submit']"
              auto-complete="off"
              :validate-on-rule-change="false"
              ref="loginFormRef"
            >
              <a-form-item  name="username" :validate-status="loginForm.username ? 'success' : undefined">
                <a-input
                  v-model="loginForm.username"
                  placeholder="用户名/手机号/邮箱"
                  size="large"
                  allow-clear
                  id="username"
                  :class="['custom-input', {'has-value': loginForm.username}]"
                  @input="(e) => handleInput(e, 'username')"
                >
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>
              
              <a-form-item  name="password" :validate-status="loginForm.password ? 'success' : undefined">
                <a-input-password
                  v-model="loginForm.password"
                  placeholder="密码"
                  size="large"
                  allow-clear
                  id="password"
                  :class="['custom-input', {'has-value': loginForm.password}]"
                  @keyup.enter="handleLogin"
                  @input="(e) => handleInput(e, 'password')"
                >
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
              
              <div class="login-options">
                <a-checkbox v-model="rememberMe">记住我</a-checkbox>
                <a class="forgot-link">忘记密码?</a>
              </div>
              
              <a-form-item>
                <a-button
                  type="primary"
                  @click="handleLogin"
                  size="large"
                  :loading="loading"
                  block
                >
                  登录
                </a-button>
              </a-form-item>
              
              <div class="login-divider">
                <span>其他登录方式</span>
              </div>
              
              <div class="social-login">
                <a-button shape="circle">
                  <template #icon><WechatOutlined /></template>
                </a-button>
                <a-button shape="circle">
                  <template #icon><QqOutlined /></template>
                </a-button>
                <a-button shape="circle">
                  <template #icon><AlipayCircleOutlined /></template>
                </a-button>
              </div>
            </a-form>
          </a-tab-pane>
          
          <a-tab-pane key="register" tab="注册">
            <a-form
              :model="registerForm"
              @submit.prevent="handleRegister"
              :rules="registerRules"
              :validate-trigger="['change', 'submit']"
              auto-complete="off"
              :validate-on-rule-change="false"
              ref="registerFormRef"
            >
              <a-form-item name="username" :validate-status="registerForm.username ? 'success' : undefined">
                <a-input
                  v-model="registerForm.username"
                  placeholder="请设置用户名"
                  size="large"
                  id="register-username"
                  :class="['custom-input', {'has-value': registerForm.username}]"
                  @input="(e) => handleRegisterInput(e, 'username')"
                >
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>
              
              <a-form-item name="phone" :validate-status="registerForm.phone ? 'success' : undefined">
                <a-input
                  v-model="registerForm.phone"
                  placeholder="请输入手机号"
                  size="large"
                  id="register-phone"
                  :class="['custom-input', {'has-value': registerForm.phone}]"
                  @input="(e) => handleRegisterInput(e, 'phone')"
                >
                  <template #prefix>
                    <MobileOutlined />
                  </template>
                </a-input>
              </a-form-item>
              
              <a-form-item name="captcha" class="captcha-item" :validate-status="registerForm.captcha ? 'success' : undefined">
                <a-input
                  v-model="registerForm.captcha"
                  placeholder="请输入验证码"
                  size="large"
                  id="registerCaptcha"
                  :class="['custom-input', {'has-value': registerForm.captcha}]"
                  @input="(e) => handleRegisterInput(e, 'captcha')"
                >
                  <template #prefix>
                    <SafetyCertificateOutlined />
                  </template>
                </a-input>
                <a-button
                  class="captcha-btn"
                  :disabled="captchaLoading"
                  @click="getCaptcha"
                >
                  {{ captchaText }}
                </a-button>
              </a-form-item>
              
              <a-form-item name="password" :validate-status="registerForm.password ? 'success' : undefined">
                <a-input-password
                  v-model="registerForm.password"
                  placeholder="请设置密码"
                  size="large"
                  id="register-password"
                  :class="['custom-input', {'has-value': registerForm.password}]"
                  @input="(e) => handleRegisterInput(e, 'password')"
                >
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
              
              <a-form-item name="confirmPassword" :validate-status="registerForm.confirmPassword ? 'success' : undefined">
                <a-input-password
                  v-model="registerForm.confirmPassword"
                  placeholder="请确认密码"
                  size="large"
                  id="register-confirmPassword"
                  :class="['custom-input', {'has-value': registerForm.confirmPassword}]"
                  @input="(e) => handleRegisterInput(e, 'confirmPassword')"
                  @keyup.enter="handleRegister"
                >
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
              
              <a-form-item>
                <a-button
                  type="primary"
                  @click="handleRegister"
                  size="large"
                  :loading="loading"
                  block
                >
                  注册
                </a-button>
              </a-form-item>
              
              <div class="agreement">
                <a-checkbox v-model="agreement">我已阅读并同意</a-checkbox>
                <a>《服务协议》</a>和<a>《隐私政策》</a>
              </div>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<script setup>
import { ref, reactive, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user'
import { applyPlaceholderFix } from '@/utils/vueVersionUtils'
import { login, register } from '@/api/user'
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  WechatOutlined,
  QqOutlined,
  AlipayCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const activeKey = ref('login')
const loading = ref(false)
const rememberMe = ref(false)
const agreement = ref(false)

// 验证码
const captchaLoading = ref(false)
const captchaText = ref('获取验证码')
const captchaTimer = ref(null)
const captchaCountdown = ref(60)

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单
const registerForm = reactive({
  username: '',
  phone: '',
  captcha: '',
  password: '',
  confirmPassword: ''
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 3, message: '用户名长度不能少于3个字符', trigger: 'change' }
  ],
  
  password: [
    { required: true, message: '请输入密码', trigger: 'change'},
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'change'}
  ]
}

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 3, message: '用户名长度不能少于3个字符', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'change' },
    { len: 6, message: '验证码应为6位数字', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'change' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'change' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'change' },
    { validator: validateConfirmPassword, trigger: 'change' }
  ]
}

// 确认密码验证
function validateConfirmPassword(rule, value) {
  console.log('确认密码验证:', value, registerForm.password);
  if (value !== registerForm.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

// 获取验证码
const getCaptcha = () => {
  if (captchaLoading.value) return
  
  // 验证手机号
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    message.error('请输入正确的手机号')
    return
  }
  
  captchaLoading.value = true
  captchaText.value = `${captchaCountdown.value}秒后重试`
  
  // 这里应该调用发送验证码接口
  message.success(`验证码已发送至 ${registerForm.phone}`)
  
  captchaTimer.value = setInterval(() => {
    captchaCountdown.value--
    captchaText.value = `${captchaCountdown.value}秒后重试`
    
    if (captchaCountdown.value <= 0) {
      clearInterval(captchaTimer.value)
      captchaText.value = '获取验证码'
      captchaLoading.value = false
      captchaCountdown.value = 60
    }
  }, 1000)
}

// 添加函数，移除所有错误气泡
const preventErrorPopup = () => {
  // 移除已有的错误气泡
  message.destroy();
  
  // 延迟执行，确保捕获到所有新生成的错误气泡
  setTimeout(() => {
    const errorMessages = document.querySelectorAll('.ant-message-error, .ant-message-notice');
    errorMessages.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }, 0);
};

// 登录表单ref
const loginFormRef = ref(null)
// 注册表单ref
const registerFormRef = ref(null)

// 处理输入事件，确保数据同步
const handleInput = (e, field) => {
  // 确保移除错误提示
  preventErrorPopup();
  
  // 直接设置表单字段值，确保Vue响应式数据更新
  if (field === 'username') {
    loginForm.username = e.target.value;
    
    // 实时验证用户名长度
    if (loginForm.username && loginForm.username.length < 3) {
      // showFieldError('username', '用户名长度不能少于3个字符');
    } else {
      clearFieldError('username');
    }
  } else if (field === 'password') {
    loginForm.password = e.target.value;
    
    // 实时验证密码长度
    if (loginForm.password && loginForm.password.length < 6) {
      // showFieldError('password', '密码长度不能少于6个字符');
    } else {
      clearFieldError('password');
    }
  }
  
  console.log(`输入事件 - ${field}:`, loginForm[field]);
  
  // 更新输入框样式
  updateInputStyle(e.target);
};

// 处理注册表单输入事件，增加验证
const handleRegisterInput = (e, field) => {
  // 确保移除错误提示
  preventErrorPopup();
  
  // 直接设置表单字段值，确保Vue响应式数据更新
  registerForm[field] = e.target.value;
  
  // 根据字段类型进行验证
  switch (field) {
    case 'username':
      if (registerForm.username && registerForm.username.length < 3) {
        // showFieldError('register-username', '用户名长度不能少于3个字符');
      } else {
        clearFieldError('register-username');
      }
      break;
    case 'phone':
      if (registerForm.phone && !/^1[3-9]\d{9}$/.test(registerForm.phone)) {
        // showFieldError('register-phone', '请输入正确的手机号');
      } else {
        clearFieldError('register-phone');
      }
      break;
    case 'password':
      if (registerForm.password && registerForm.password.length < 6) {
        // showFieldError('register-password', '密码长度不能少于6个字符');
      } else {
        clearFieldError('register-password');
      }
      // 如果确认密码已输入，检查两次密码是否一致
      if (registerForm.confirmPassword && 
          registerForm.password !== registerForm.confirmPassword) {
        // showFieldError('register-confirmPassword', '两次输入的密码不一致');
      } else if (registerForm.confirmPassword) {
        clearFieldError('register-confirmPassword');
      }
      break;
    case 'confirmPassword':
      if (registerForm.password !== registerForm.confirmPassword) {
        // showFieldError('register-confirmPassword', '两次输入的密码不一致');
      } else {
        clearFieldError('register-confirmPassword');
      }
      break;
  }
  
  console.log(`注册表单输入 - ${field}:`, registerForm[field]);
  
  // 更新输入框样式
  updateInputStyle(e.target);
};

// 添加显示字段错误的函数
function showFieldError(fieldId, errorMessage) {
  // 查找对应的输入框元素
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;
  
  // 查找对应的表单项
  const formItem = inputEl.closest('.ant-form-item');
  if (!formItem) return;
  
  // 为表单项添加错误状态样式
  formItem.classList.add('ant-form-item-has-error');
  
  // 查找或创建错误提示元素
  let errorEl = document.getElementById(`${fieldId}-error`);
  
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = `${fieldId}-error`;
    errorEl.className = 'field-error-message';
    
    // 查找表单项中现有的错误提示容器
    let errorContainer = formItem.querySelector('.ant-form-item-explain');
    
    // 如果没有错误提示容器，则创建一个
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'ant-form-item-explain ant-form-item-explain-error';
      formItem.appendChild(errorContainer);
    }
    
    // 将错误消息添加到容器中
    errorContainer.appendChild(errorEl);
  }
  
  // 设置错误消息内容并显示
  errorEl.textContent = errorMessage;
  errorEl.style.display = 'block';
  
  // 移除成功状态
  formItem.classList.remove('ant-form-item-has-success');
}

// 清除字段错误提示
function clearFieldError(fieldId) {
  // 查找对应的输入框元素
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;
  
  // 查找对应的表单项
  const formItem = inputEl.closest('.ant-form-item');
  if (!formItem) return;
  
  // 移除错误状态样式
  formItem.classList.remove('ant-form-item-has-error');
  
  // 隐藏错误提示元素
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) {
    errorEl.style.display = 'none';
  }
  
  // 如果输入框有值，添加成功状态
  if (inputEl.value && inputEl.value.trim()) {
    formItem.classList.add('ant-form-item-has-success');
  }
}

// 更新输入框样式
function updateInputStyle(input) {
  if (!input) return;
  
  // 获取最外层包装元素
  const wrapper = input.closest('.ant-input-affix-wrapper') || 
                input.closest('.custom-input') || 
                input.parentNode;
  
  if (wrapper) {
    if (input.value && input.value.trim()) {
      wrapper.classList.add('has-value');
      input.classList.add('not-empty');
    } else {
      wrapper.classList.remove('has-value');
      input.classList.remove('not-empty');
    }
  }
}

// 登录
const handleLogin = async () => {
  console.log("用户名：" + loginForm.username);
  // 移除所有可能的错误提示
  message.destroy();
  
  // 确保表单数据是最新的
  console.log("登录表单数据:", { 
    username: loginForm.username || '空', 
    password: loginForm.password ? '已输入' : '未输入' 
  });
  
  // 验证表单
  if (!loginForm.username) {
    message.error({
      content: '请输入用户名',
      duration: 2
    });
    return;
  }
  
  if (!loginForm.password) {
    message.error({
      content: '请输入密码',
      duration: 2
    });
    return;
  }
  
  loading.value = true;
  
  try {
    // 实际的API调用
    console.log('正在提交登录，用户名:', loginForm.username);
    
    const response = await login({
      username: loginForm.username,
      password: loginForm.password
    });
    
    console.log('登录响应:', response);
    
    if (response.code === 0 || response.code === 200) {
      // 保存用户信息
      const userData = response.data;
      userStore.setToken(userData.token);
    userStore.setUserInfo({
        id: userData.userId,
        username: userData.username,
        avatar: userData.avatarUrl || '',
        role: userData.role
      });
      
      message.success(response.message || '登录成功');
      router.push('/');
    } else {
      message.error(response.message || '登录失败');
    }
  } catch (error) {
    console.error('登录失败详情:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    
    message.error(error.message || '登录失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

// 注册
const handleRegister = async () => {
  console.log("注册按钮点击");
  
  // 首先清除所有错误消息
  message.destroy();
  
  // 直接读取DOM中的实际输入值
  const usernameInput = document.querySelector('#registerUsername');
  const phoneInput = document.querySelector('#registerPhone');
  const captchaInput = document.querySelector('#registerCaptcha');
  const passwordInput = document.querySelector('#registerPassword');
  const confirmPasswordInput = document.querySelector('#registerConfirmPassword');
  
  const usernameValue = usernameInput ? usernameInput.value : registerForm.username;
  const phoneValue = phoneInput ? phoneInput.value : registerForm.phone;
  const captchaValue = captchaInput ? captchaInput.value : registerForm.captcha;
  const passwordValue = passwordInput ? passwordInput.value : registerForm.password;
  const confirmPasswordValue = confirmPasswordInput ? confirmPasswordInput.value : registerForm.confirmPassword;
  
  // 同步到响应式数据，确保Vue的状态与DOM一致
  registerForm.username = usernameValue || '';
  registerForm.phone = phoneValue || '';
  registerForm.captcha = captchaValue || '';
  registerForm.password = passwordValue || '';
  registerForm.confirmPassword = confirmPasswordValue || '';
  
  console.log("实际注册表单值:", {
    username: registerForm.username || '空',
    phone: registerForm.phone || '空',
    captcha: registerForm.captcha ? '已输入' : '未输入',
    password: registerForm.password ? '已输入' : '未输入',
    confirmPassword: registerForm.confirmPassword ? '已输入' : '未输入',
    agreement: agreement.value
  });
  
  // 强制更新输入框样式状态
  setTimeout(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.value && input.value.trim()) {
        const wrapper = input.closest('.ant-input-affix-wrapper') || 
                      input.closest('.custom-input') || 
                      input.parentNode;
        if (wrapper) {
          wrapper.classList.add('has-value');
          input.classList.add('not-empty');
        }
      }
    });
  }, 0);
  
  // 使用更新后的响应式数据进行验证
  if (!registerForm.username) {
    message.error({
      content: '请输入用户名',
      duration: 2
    });
    return;
  }
  
  if (!registerForm.phone) {
    message.error({
      content: '请输入手机号',
      duration: 2
    });
    return;
  }
  
  // 验证手机号格式
  if (registerForm.phone && !/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    message.error({
      content: '请输入正确的手机号',
      duration: 2
    });
    return;
  }
  
  if (!registerForm.password) {
    message.error({
      content: '请设置密码',
      duration: 2
    });
    return;
  }
  
  // 验证密码长度
  if (registerForm.password && registerForm.password.length < 6) {
    message.error({
      content: '密码长度不能少于6个字符',
      duration: 2
    });
    return;
  }
  
  if (!registerForm.confirmPassword) {
    message.error({
      content: '请确认密码',
      duration: 2
    });
    return;
  }
  
  // 验证两次密码是否一致
  if (registerForm.password !== registerForm.confirmPassword) {
    message.error({
      content: '两次输入的密码不一致',
      duration: 2
    });
    return;
  }
  
  // 验证是否同意协议 - 直接获取复选框的DOM元素检查
  const agreementCheckbox = document.querySelector('.agreement .ant-checkbox-input');
  // 如果DOM元素被选中或响应式变量为true，都认为用户已同意
  const hasAgreed = (agreementCheckbox && agreementCheckbox.checked) || agreement.value;
  agreement.value = hasAgreed; // 同步到响应式变量
  
  if (!hasAgreed) {
    message.error({
      content: '请阅读并同意服务协议和隐私政策',
      duration: 2
    });
    return;
  }
  
  // 使用最终的表单值
  const finalUsername = registerForm.username;
  const finalPhone = registerForm.phone;
  
  loading.value = true;
  
  try {
    // 实际的API调用
    console.log('正在提交注册信息:', {
      username: finalUsername,
      phone: finalPhone,
      password: '已加密'
    });
    
    const response = await register({
      username: finalUsername,
      password: registerForm.password,
      phone: finalPhone,
      email: null // 如果需要邮箱，应该在表单中添加
    });
    
    console.log('注册响应:', response);
    
    if (response.code === 0 || response.code === 200) {
      message.success(response.message || '注册成功，请登录');
      activeKey.value = 'login';
      loginForm.username = finalUsername;
    } else {
      message.error(response.message || '注册失败');
    }
  } catch (error) {
    console.error('注册失败:', error);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    message.error(error.message || '注册失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

// 修改 watchEffect 的实现
watchEffect(() => {
  // 直接打印响应式数据变化，简化调试
  console.log('表单数据:', {
    username: loginForm.username || '空',
    password: loginForm.password ? '已输入' : '未输入'
  });

  // 当输入内容变化时，清除表单验证状态
  if (loginForm.username || loginForm.password) {
    if (loginFormRef.value) {
      loginFormRef.value.clearValidate();
    }
  }
});

// 修复表单验证提示问题
onMounted(() => {
  // 应用占位符修复，传入表单数据对象
  applyPlaceholderFix(loginForm, registerForm);
  
  // 确保表单重置为空值
  loginForm.username = '';
  loginForm.password = '';
  
  // 注册表单也重置
  Object.keys(registerForm).forEach(key => {
    registerForm[key] = '';
  });
  
  // 添加表单提交和按钮点击监听
  setTimeout(() => {
    // 监听表单提交事件
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('表单提交被拦截');
      });
    });
    
    // 确保按钮点击时同步数据
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('表单数据状态：', {
          登录表单: { 
            username: loginForm.username || '空', 
            password: loginForm.password ? '已输入' : '未输入' 
          },
          注册表单: {
            username: registerForm.username || '空',
            phone: registerForm.phone || '空',
            // 其他字段...
          }
        });
      });
    });
    
    // 同步复选框状态
    document.querySelectorAll('.ant-checkbox-input').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.closest('.agreement')) {
          agreement.value = checkbox.checked;
          console.log('协议勾选状态：', agreement.value);
        } else if (checkbox.closest('.login-options')) {
          rememberMe.value = checkbox.checked;
          console.log('记住我状态：', rememberMe.value);
        }
      });
    });
    
    // 初始化验证函数
    initializeValidation();
  }, 300);
})

// 初始化表单验证函数
function initializeValidation() {
  // 创建Ant Design的表单验证容器
  const formItems = document.querySelectorAll('.ant-form-item');
  formItems.forEach(formItem => {
    // 查找是否已有验证容器
    if (!formItem.querySelector('.ant-form-item-explain')) {
      const explainDiv = document.createElement('div');
      explainDiv.className = 'ant-form-item-explain';
      formItem.appendChild(explainDiv);
    }
  });
  
  // 为每个输入框添加blur事件，在失焦时进行验证
  const loginUsernameInput = document.getElementById('username');
  if (loginUsernameInput) {
    loginUsernameInput.addEventListener('blur', () => {
      if (loginForm.username && loginForm.username.length < 3) {
        showFieldError('username', '用户名长度不能少于3个字符');
      }
    });
  }
  
  const loginPasswordInput = document.getElementById('password');
  if (loginPasswordInput) {
    loginPasswordInput.addEventListener('blur', () => {
      if (loginForm.password && loginForm.password.length < 6) {
        showFieldError('password', '密码长度不能少于6个字符');
      }
    });
  }
  
  // 注册表单验证
  const registerUsernameInput = document.getElementById('register-username');
  if (registerUsernameInput) {
    registerUsernameInput.addEventListener('blur', () => {
      if (registerForm.username && registerForm.username.length < 3) {
        showFieldError('register-username', '用户名长度不能少于3个字符');
      }
    });
  }
  
  const registerPhoneInput = document.getElementById('register-phone');
  if (registerPhoneInput) {
    registerPhoneInput.addEventListener('blur', () => {
      if (registerForm.phone && !/^1[3-9]\d{9}$/.test(registerForm.phone)) {
        showFieldError('register-phone', '请输入正确的手机号');
      }
    });
  }
  
  const registerPasswordInput = document.getElementById('register-password');
  if (registerPasswordInput) {
    registerPasswordInput.addEventListener('blur', () => {
      if (registerForm.password && registerForm.password.length < 6) {
        showFieldError('register-password', '密码长度不能少于6个字符');
      }
    });
  }
  
  const registerConfirmPasswordInput = document.getElementById('register-confirmPassword');
  if (registerConfirmPasswordInput) {
    registerConfirmPasswordInput.addEventListener('blur', () => {
      if (registerForm.password !== registerForm.confirmPassword) {
        showFieldError('register-confirmPassword', '两次输入的密码不一致');
      }
    });
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  background-size: cover;
}

.login-form-wrapper {
  width: 420px;
  max-width: 100%;
  padding: 0 16px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h1 {
  font-size: 28px;
  color: white;
  margin-top: 12px;
}

.logo {
  width: 64px;
  height: 64px;
}

.login-card {
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.forgot-link {
  color: #1890ff;
}

.login-divider {
  position: relative;
  text-align: center;
  margin: 16px 0;
}

.login-divider::before,
.login-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 60px);
  height: 1px;
  background-color: #f0f0f0;
}

.login-divider::before {
  left: 0;
}

.login-divider::after {
  right: 0;
}

.login-divider span {
  display: inline-block;
  padding: 0 16px;
  background-color: white;
  position: relative;
  color: #888;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.captcha-item {
  display: flex;
  gap: 8px;
}

.captcha-btn {
  flex-shrink: 0;
  width: 120px;
}

.agreement {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.agreement a {
  color: #1890ff;
}

/* 自定义覆盖样式，解决占位符问题 */
.placeholder-fix {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  pointer-events: none;
  color: transparent;
  z-index: 0;
}

/* 使用CSS变量来支持动态修改样式 */
:root {
  --placeholder-color: rgba(0, 0, 0, 0.25);
  --input-text-color: rgba(0, 0, 0, 0.88);
  --focus-color: #1890ff;
  --error-color: #ff4d4f;
}

/* 设置输入框样式的通用类 */
.input-wrapper {
  position: relative;
}

/* 确保输入框文本颜色正确 */
:deep(.ant-input) {
  color: var(--input-text-color) !important;
  font-weight: normal;
}

/* 使用叠加的方式解决占位符和输入内容重叠问题 */
:deep(.ant-form-item) {
  position: relative;
}

/* 解决输入框样式问题的最终解决方案 - 使用更高优先级的选择器 */
:deep(.custom-input.has-value) input::placeholder
/* :deep(.custom-input input:not(:placeholder-shown))::placeholder */
 {
  color: transparent !important;
  opacity: 0 !important;
}

/* 清除按钮的样式 */
:deep(.ant-input-clear-icon) {
  color: rgba(0, 0, 0, 0.25);
}

:deep(.ant-input-clear-icon:hover) {
  color: rgba(0, 0, 0, 0.45);
}

/* 确保密码框图标颜色正确 */
:deep(.ant-input-password-icon) {
  color: rgba(0, 0, 0, 0.45);
}

@media (max-width: 480px) {
  .login-form-wrapper {
    width: 100%;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
}

/* 自定义表单验证状态样式 */
:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-form-item-with-help) {
  margin-bottom: 28px;
}

/* 仅在表单项无内容时显示错误信息 */
:deep(.has-value + .ant-form-item-explain-error) {
  display: none;
}

/* 仅在表单项聚焦时隐藏错误信息 */
:deep(.ant-form-item:focus-within .ant-form-item-explain-error) {
  display: none;
}

/* 当输入内容时设置为成功状态 */
:deep(.ant-form-item-has-success .ant-input),
:deep(.ant-form-item-has-success .ant-input-affix-wrapper) {
  border-color: #52c41a !important;
}

/* 错误信息渐变显示 */
:deep(.ant-form-item-explain-error) {
  animation: fadeIn 0.3s;
  transition: opacity 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加新的样式来处理输入状态 */
:deep(.ant-input-affix-wrapper) {
  transition: all 0.3s;
}

:deep(.ant-input-affix-wrapper.ant-input-affix-wrapper-focused),
:deep(.ant-input-affix-wrapper:focus) {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.custom-input.has-value) {
  border-color: #52c41a !important; 
}

:deep(.custom-input.has-value .ant-input) {
  background-color: rgba(82, 196, 26, 0.05) !important;
}

:deep(.custom-input.has-value .ant-input-prefix .anticon) {
  color: #52c41a !important;
}

/* 修复占位符问题 */
:deep(.ant-input:not(:placeholder-shown)) {
  background-color: rgba(82, 196, 26, 0.05) !important;
}

:deep(.ant-input:not(:placeholder-shown) + .ant-input-prefix .anticon) {
  color: #52c41a !important;
}

/* 输入框占位符完全消失 */
:deep(.ant-input:not(:placeholder-shown)::placeholder) {
  color: transparent !important;
  opacity: 0 !important;
}

/* 调整表单项间距 */
:deep(.ant-form-item:not(:last-child)) {
  margin-bottom: 24px;
}

/* 修复输入框占位符和输入内容重叠问题的核心样式 */
:deep(.ant-input-affix-wrapper) {
  position: relative;
  transition: all 0.3s;
}

:deep(.ant-input) {
  transition: all 0.3s ease;
}

/* 输入框获得焦点时的样式 */
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* 输入框有值时的样式 */
:deep(.ant-input-affix-wrapper.has-value) {
  border-color: #52c41a !important;
}

:deep(.ant-input-affix-wrapper.has-value .ant-input-prefix .anticon) {
  color: #52c41a !important;
}

/* 确保输入框有值时占位符不可见 */
:deep(.ant-input.not-empty::placeholder),
:deep(.ant-input-affix-wrapper.has-value .ant-input::placeholder) {
  color: transparent !important;
  opacity: 0 !important;
}

/* 使用更具体的选择器来处理已有值的输入框 */
:deep(.custom-input.has-value),
:deep(input[value]:not([value=""]))
/* :deep(input:not(:placeholder-shown)) */
{
  background-color: rgba(82, 196, 26, 0.05);
}

/* 确保在Vue渲染前后有值的输入框样式一致 */
:deep(input[value]:not([value=""]) + .ant-input-prefix .anticon),
:deep(input:not(:placeholder-shown) + .ant-input-prefix .anticon) {
  color: #52c41a !important;
}

/* 解决Ant Design输入框特有的样式问题 */
:deep(.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover) {
  border-color: #40a9ff;
}

:deep(.ant-input-affix-wrapper.has-value:not(.ant-input-affix-wrapper-disabled):hover) {
  border-color: #52c41a !important;
}

/* 添加错误提示样式 */
.field-error-message {
  font-size: 14px;
  color: #ff4d4f;
  line-height: 1.5;
  transition: all 0.3s;
  margin-top: 4px;
  display: block;
  position: relative;
  padding-left: 24px;
  animation: fadeIn 0.3s;
}

/* 表单项错误状态样式 */
:deep(.ant-form-item-has-error .ant-input),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper) {
  border-color: #ff4d4f !important;
  background-color: #fff6f6 !important;
}

:deep(.ant-form-item-has-error .ant-input:focus),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper-focused) {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
}

:deep(.ant-form-item-has-error .ant-input:hover),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper:hover) {
  border-color: #ff7875 !important;
}

:deep(.ant-form-item-has-error .ant-input-prefix .anticon),
:deep(.ant-form-item-has-error .ant-input-suffix .anticon) {
  color: #ff4d4f !important;
}

/* 自定义Ant Design表单验证提示 */
:deep(.ant-form-item-explain) {
  clear: both;
  min-height: 24px;
  color: #ff4d4f;
  transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  padding-top: 4px;
}

:deep(.ant-form-item-explain-error) {
  color: #ff4d4f;
}

/* 输入框错误和成功状态的动画效果 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

:deep(.ant-form-item-has-error) {
  animation: shake 0.6s;
}

/* 修改表单验证后的错误提示对比度，使其更明显 */
:deep(.ant-form-item-has-error .ant-form-item-explain-error) {
  color: #ff4d4f;
  font-weight: 500;
}
</style> 