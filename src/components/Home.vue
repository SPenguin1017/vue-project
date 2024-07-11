<template>
    <div class = "login-box">
      <form @submit.prevent="submitForm">
        <div class="user-box">
          <input type="text" id="databaseHost" v-model="textInput[0].value" required=""/>
          <label>資料庫Host</label>
        </div>
        <div class="user-box">
          <input type="text" id="databaseName" v-model="textInput[1].value" required=""/>
          <label>資料庫名稱</label>
        </div>
        <div class="user-box">
          <input type="text" id="username" v-model="textInput[2].value" required=""/>
          <label>使用者帳號</label>
        </div>  
        <div class="user-box">
          <input type="password" id="password" v-model="textInput[3].value" required=""/>
          <label>使用者密碼</label>
        </div>
        <div class="user-box">
          <input type="text" id="tableName" v-model="textInput[4].value" required=""/>
          <label>Table名稱</label>
        </div>
        <div class="user-box">
          <input type="text" id="maxLenField" v-model="textInput[5].value" required=""/>
          <label>Max_Len</label>
        </div>
        <div class="user-box">
          <input type="text" id="mail" v-model="textInput[6].value" required=""/>
          <label>通知信箱</label>
        </div>
        <div class="user-box">
          <input type="file" accept=".xlsx" @change="handleFileChange"/>
        </div>
        <div>
          <div class = "form-row">
            <div>
              <label>資料庫類型</label>
              <select v-model="textInput[7].value" style="margin-right: 30px" >
                <option v-for="option in options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="checkbox-wrapper-4">
              <input class="inp-cbx" id="morning" type="checkbox" v-model="textInput[8].value" />
              <label class="cbx" for="morning">
                <span> <svg id="svg" width="12px" height="10px"></svg></span>
                <span>是否truncate</span>
              </label>
            </div>
          </div>
        </div>
        <div> 
          <button @click="summit">提交<span></span></button>
        </div>
      </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {

  name: 'App',

  data() {
    return {
      selectedFile: null,
      textInput: [
        { value: '', label: '資料庫Host' },
        { value: '', label: '資料庫名稱' },
        { value: '', label: '使用者帳號' },
        { value: '', label: '使用者密碼' },
        { value: '', label: 'table名稱' },
        { value: '', label: 'max_len的欄位名稱' },
        { value: '', label: '通知信箱' },
        { value: '', label: '資料庫類型' },
        { value: 'N', label: '是否truncate' }
      ],
      options: [
        { value: 'ORACLE', label: 'ORACLE' },
        { value: 'MYSQL', label: 'MYSQL' },
        { value: 'MSSQL', label: 'MSSQL' },
        { value: 'MONGO', label: 'MONGO' }
      ]
    };
  },

  methods: {

    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    async summit(event) {

      if (!this.selectedFile) {
          alert('請先選擇一個文件');
          return;
        }

        for (let input of this.textInput) {
        if (input.label !== '是否truncate' && !input.value) {
          alert(`請填寫${input.label}`);
          return false;
        }
      }
            
      const payload = this.textInput.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {});

      const formData = new FormData();
      formData.append('metadata', JSON.stringify(payload));
      formData.append('file', this.selectedFile);

      try {
        const response = await axios.post('http://localhost:8070/api/submit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Success:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
      this.$router.push({ 
        name: 'SecondPage', query: {databaseName : this.textInput[1].value, file:this.selectedFile.name, tableName :this.textInput[4].value}
      }); 
    }

  }

};
</script>

<style scoped>

button{
  border: none;
  background-color: rgba(24, 20, 20, 0.987);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  padding: 50px;
  transform: translate(-50%, -50%);
  background: rgba(24, 20, 20, 0.987);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 18px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #bdb8b8;
  font-size: 12px;
}

.login-box form button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 20px;
  letter-spacing: 4px;
  border-radius: 10px;
}

.login-box button:hover {
  background: #013d8b;
  color: #fff;
  box-shadow: 0 0 5px #013d8b,
              0 0 25px #013d8b,
              0 0 50px #013d8b,
              0 0 100px #013d8b;
}

.login-box button span {
  position: absolute;
  display: block;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,100% {
    left: 100%;
  }
}

.login-box button span:nth-child(1) {
  bottom: 0px;
  left: -100%;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #2a46e2);
  animation: btn-anim1 2.5s linear infinite;
}

.checkbox-wrapper-4 * {
  box-sizing: border-box;
  color: white;
}

.checkbox-wrapper-4 .cbx {
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s ease;
  display: inline-block;
}

.checkbox-wrapper-4 .cbx:not(:last-child) {
  margin-right: 6px;
}

.checkbox-wrapper-4 .cbx:hover {
  background: linear-gradient(
    90deg,
    rgb(2, 127, 230) 0%,
    rgba(126, 28, 145, 1) 100%
  );
}

.cbx:not(:hover) span svg {
  color: red;
  stroke: red;
}

.checkbox-wrapper-4 .cbx span {
  float: left;
  vertical-align: middle;
  transform: translate3d(0, 0, 0);
}

.checkbox-wrapper-4 .cbx span:first-child {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  transform: scale(1);
  border: 1px solid #cccfdb;
  transition: all 0.2s ease;
  box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
}

.checkbox-wrapper-4 .cbx span:first-child svg {
  position: absolute;
  top: 3px;
  left: 2px;
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16px;
  stroke-dashoffset: 16px;
  transition: all 0.3s ease;
  transition-delay: 0.1s;
  transform: translate3d(0, 0, 0);
}

.checkbox-wrapper-4 .cbx span:last-child {
  padding-left: 8px;
  line-height: 18px;
}

.checkbox-wrapper-4 .cbx:hover span:first-child {
  border-color: #fff;
}

.checkbox-wrapper-4 .inp-cbx {
  position: absolute;
  visibility: hidden;
}

.checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child {
  background: #fff;
  border-color: #fff;
  transition: rotate 2s;
  transform: rotateZ(45deg);
  animation: wave-4 0.6s ease;
}

.checkbox-wrapper-4 .inp-cbx:checked + .cbx:not(:hover) span:first-child {
  background: linear-gradient(
    90deg,
    rgb(2, 127, 230) 0%,
    rgba(126, 28, 145, 1) 100%
  );
  border-color: linear-gradient(
    90deg,
    rgb(2, 127, 230) 0%,
    rgba(126, 28, 145, 1) 100%
  );
}

.checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child svg {
  stroke-dashoffset: 0;
}

.checkbox-wrapper-4 .inline-svg {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  user-select: none;
}

@media screen and (max-width: 640px) {
  .checkbox-wrapper-4 .cbx {
    width: 100%;
    display: inline-block;
  }
}

@-moz-keyframes wave-4 {
  33% {
    transform: scale(1.3);
  }
  66% {
    transform: scale(0.8);
  }
}

@-webkit-keyframes wave-4 {
  33% {
    transform: scale(1.3);
  }
  66% {
    transform: scale(0.8);
  }
}

@-o-keyframes wave-4 {
  33% {
    transform: scale(1.3);
  }
  66% {
    transform: scale(0.8);
  }
}

@keyframes wave-4 {
  33% {
    transform: scale(1.3);
  }
  66% {
    transform: scale(0.8);
  }
}

.form-row {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 18px;
  color:#fff;
}

.form-row label {
  margin-right: 10px;
}

</style>