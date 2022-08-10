<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">INK BOOK</h3>
      </div>

      <el-form-item prop="userEmail">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.userEmail"
          placeholder="邮箱"
          name="userEmail"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item v-if="!isLogin" prop="userRealName">
        <span class="svg-container">
          <svg-icon icon-class="person" />
        </span>
        <el-input
          ref="userRealName"
          v-model="loginForm.userRealName"
          placeholder="姓名"
          name="userRealName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item v-if="!isLogin" prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.userName"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--邮箱验证-->
      <el-form-item v-if="!isLogin" prop="userEmailcode">
        <span class="svg-container">
          <svg-icon icon-class="key" />
        </span>
        <el-input
          ref="userEmailcode"
          v-model="loginForm.userEmailcode"
          placeholder="邮箱验证码"
          style="width:69%"
          name="userEmailcode"
          type="text"
          tabindex="1"
        />
        <span>
          <el-button :loading="sendmailloading" style="width:23%; background-color: #97a8be; border-color: #97a8be" type="primary" @click="sendemail">
            {{ 0 == statuscode ? '发送邮件' : statuscode }}
          </el-button>
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; background-color: #97a8be; border-color: #97a8be"
        @click.native.prevent="handleLoginOrRegister"
      >{{ isLogin ? "登录" : "注册" }}</el-button>

      <div class="tips" @click="isLogin = !isLogin">
        {{ isLogin ? "还没有账号？立即注册" : "已有账号，立即登录" }}
        <!-- <span style="margin-right: 20px">username: admin</span>
        <span> password: any</span> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import { register, sendEmail } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userEmail: '',
        password: '',
        userRealName: '',
        userName: '',
        userEmailcode: ''
      },
      // 用于保存后端传进来的邮件验证码
      rexuserEmailcode: '',
      statuscode: 0,
      loginRules: {
        userEmail: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        userRealName: [{ required: true, trigger: 'blur', message: '请输入真实姓名' }],
        userName: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        userEmailcode: [{ required: true, trigger: 'blur', message: '请输入邮箱验证码' }]
      },
      loading: false,
      sendmailloading: false,
      passwordType: 'password',
      redirect: undefined,
      isLogin: true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    sendemail() {
      if (this.loginForm.userEmail === '') {
        this.$message.error('请输入邮箱!')
        return
      } else if (!/\w+@(\w+.)+[a-z]{2,3}/.test(this.loginForm.userEmail)) {
        this.$message.error('邮箱格式不正确！')
        return
      }

      sendEmail({ userEmail: this.loginForm.userEmail })
        .then((res) => {
          console.log(res)
          this.sendmailloading = true
          if (res.code !== 1) {
            this.$message.error(res.msg)
            this.sendmailloading = false
            this.statuscode = 0
            return
          }
          if (res.code === 1) {
            console.log(this.sendmailloading)
            this.$message.success('发送邮件成功！')
            // 保存邮箱验证码
            this.rexuserEmailcode = res.data
            // eslint-disable-next-line no-unused-vars
            let service = ''
            this.statuscode = 60
            service = setInterval(() => {
              if (this.statuscode === 0) {
                clearInterval(service)
                this.statuscode = 0
                this.sendmailloading = false
                return
              }
              this.statuscode = this.statuscode - 1
            }, 1000)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLoginOrRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.isLogin) {
            this.loading = true
            // 登录逻辑
            const { userEmail, password } = this.loginForm
            this.$store
              .dispatch('user/login', {
                userEmail,
                password
              })
              .then(() => {
                // console.log(res)
                // if (res.data === null || res.data === '') {
                //   alert('登陆失败！请重试！')
                //   return
                // }
                console.log('login')
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            // 注册逻辑
            if (this.loginForm.userEmailcode.trim() === this.rexuserEmailcode) {
              this.loading = true
              register(this.loginForm)
                .then((res) => {
                  if (res.code !== 1) {
                    this.$message.error(res.msg)
                    this.loading = false
                    return
                  }
                  this.$message.success('注册成功，立即登录！')
                  this.isLogin = true
                  this.loading = false
                })
                .catch(() => {
                  this.loading = false
                })
            } else {
              this.$message.error('邮箱验证码错误！请重新输入！')
              return false
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #fff;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #222222;
      height: 47px;
      caret-color: #222222;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #e6e6e6 inset !important;
        -webkit-text-fill-color: #222222 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

.login-container {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/login_images/login_bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
    cursor: pointer;
    text-align: right;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #666666;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #666666;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #666666;
    cursor: pointer;
    user-select: none;
  }
}
</style>
