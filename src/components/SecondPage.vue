<template>
  <div class="login-box">
    <div class="user-row">
      <div class="user-box">
        <input type="text" v-model="sDatabaseName" required />
        <label>資料庫名稱</label>
      </div>
      <div class="user-box">
        <input type="text" v-model="sFile" required />
        <label>檔案名稱</label>
      </div>
      <div class="user-box">
        <input type="text" v-model="sTableName" required />
        <label>Table名稱</label>
      </div>
      <div>
        <button class="button" @click="searchData">
          <span>
            <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>

    <div v-if="tableData">
      <el-table :data="tableData.data" style="width: 100%" class="table">
        <el-table-column prop="databaseType" label="資料庫類型" align ="center"></el-table-column>
        <el-table-column prop="databaseHost" label="資料庫Host" align ="center"></el-table-column>
        <el-table-column prop="dbName" label="資料庫名稱" align ="center"></el-table-column>
        <el-table-column prop="tableName" label="Table名稱" align ="center"></el-table-column>
        <el-table-column prop="maxLen" label="max_len" align ="center"></el-table-column>
        <el-table-column prop="file" label="檔案" align ="center"></el-table-column>
        <el-table-column prop="truncate" label="是否truncate" align ="center">
          <template v-slot="scope">
            {{ scope.row.truncate ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="notificationEmail" label="通知信箱" align="center"></el-table-column>
        <el-table-column prop="successCount" label="成功筆數" align="center"></el-table-column>
        <el-table-column prop="failCount" label="失敗筆數" align="center"></el-table-column>
        <el-table-column prop="submitTime" label="送出時間" align="center"></el-table-column>
        <el-table-column prop="completeTime" label="完成時間" align="center"></el-table-column>
        <el-table-column label="原始檔案下載" align="center">
          <template v-slot="scope">
            <a :href="scope.row.originalFileURL" target="_blank" >下載</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-controls">
        
        <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
        <span>第 {{ currentPage }} 頁 / 總 {{ tableData.pages }} 頁</span>
        <button @click="nextPage" :disabled="currentPage === tableData.pages">下一頁</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['databaseName','file','tableName'],
  data() {
    return {
      sDatabaseName: this.databaseName,
      sFile: this.file,
      sTableName: this.tableName,
      tableData: null,
      currentPage: 1,
      pageSize: 7,
      totalRecords: 0
    };
  },
  mounted() {
    this.sDatabaseName = this.$route.query.databaseName || '';
    this.sFile = this.$route.query.file || '';
    this.sTableName = this.$route.query.tableName || '';
  },
  methods: {
    async searchData() {
      
      const formData = new FormData();
      formData.append('sDatabaseName', this.sDatabaseName);
      formData.append('sTableName', this.sTableName);
      formData.append('file', this.sFile);

      try {
        const response = await axios.post('http://localhost:8070/api/status', formData ,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Response Data:', response.data);
        console.log('sDatabaseName:', this.databaseName);
        console.log('sFile:', this.file);
        console.log('sTableName:', this.tableName);


        this.totalRecords = response.data.length;

        const totalPages = Math.ceil(this.totalRecords / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        const paginatedData = response.data.slice(startIndex, endIndex);

        this.tableData = {
          data: paginatedData,
          total: this.totalRecords,
          pages: totalPages
        };

      } catch (error) {
        console.error('Error:', error);
      }
    },
  handleCurrentChange(page) {
    this.currentPage = page;
    this.searchData();
  },
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchData();
    }
  },
  nextPage() {
    if (this.currentPage < this.tableData.pages) {
      this.currentPage++;
      this.searchData();
    }
  }
  }
};
</script>


<style scoped>

.button {
  position: relative;
  border: none;
  background-color: rgba(24, 20, 20, 0.987);
  color: rgb(251, 242, 225);;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  gap: 10px;
  border-radius: 15px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  box-shadow: 0 5px 20px rgb(251, 242, 225);;
  cursor: pointer;
  overflow: hidden;
  top: -20px;
}

.button span {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.button::before {
  content: "";
  position: absolute;
  background-color: rgba(24, 20, 20, 0.987);
  width: 100%;
  height: 100%;
  left: 0%;
  bottom: 0%;
  transform: translate(-100%, 100%);
  border-radius: inherit;
}

.button svg {
  fill: rgb(251, 242, 225);;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.button:hover::before {
  animation: shakeBack 0.6s forwards;
}

.button:hover svg {
  fill: white;
  scale: 1.3;
}

.button:active {
  box-shadow: none;
}

@keyframes shakeBack {
  0% {
    transform: translate(-100%, 100%);
  }

  50% {
    transform: translate(20%, -20%);
  }

  100% {
    transform: translate(0%, 0%);
  }
}


.user-row {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1750px;
  padding: 100px;
  transform: translate(-50%, -50%);
  background: rgba(24, 20, 20, 0.987);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
}

.login-box .user-box {
  position: relative;
  margin-right: 40px;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: rgb(251, 242, 225);;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid rgb(251, 242, 225);;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 18px;
  color: rgb(251, 242, 225);;
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
  color: rgba(24, 20, 20, 0.987);
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 20px;
  letter-spacing: 4px;
}

.login-box button:hover {
  background: rgb(251, 242, 225);;
  color: rgb(251, 242, 225);;
  box-shadow: 0 0 5px #013d8b,
              0 0 25px #013d8b,
              0 0 50px #013d8b,
              0 0 100px #013d8b;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,100% {
    left: 100%;
  }
}

:deep(.el-table__row) {
  color:rgb(251, 242, 225);;
  background-color: rgba(24, 20, 20, 0.987);
  text-align: center;
}

:deep(.el-table__row):hover{
  color: rgba(24, 20, 20, 0.987);
}

:drrp(.el-table tr){
  background-color: #fff;
  color: rgba(24, 20, 20, 0.987);
}

:deep(.el-table th){
  color: #fff;
  background-color: rgba(24, 20, 20, 0.987) !important;
}

.pagination-controls {
  display: flex;
  justify-content: flex-end; /* 使按鈕在右邊顯示 */
  margin-top: 10px;
}

.pagination-controls button {
  margin: 0 5px; /* 按鈕間距 */
}


</style>
