<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- 标签页 -->
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <!-- 新增角色按钮 -->
              <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible = true">新增角色</el-button>
            </el-row>
            <!-- 角色表格 -->
            <el-table border :data="rolesList">
              <el-table-column type="index" label="序号" width="120px" align="center" />
              <el-table-column prop="name" label="角色名称" width="240px" header-align="center" />
              <el-table-column prop="description" label="描述" header-align="center" />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="success" size="small">分配角色</el-button>
                  <el-button type="primary" size="small" @click="editRoles(scope.row)">编辑角色</el-button>
                  <el-button type="info" size="small" @click="removeRoles(scope.row)">删除角色</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center" style="height: 60px">
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :current-page="page.page"
                :page-size="page.pagesize"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 提示 -->
            <el-row style="height: 50px">
              <el-alert
                title="公司信息请谨慎修改"
                type="info"
                show-icon
                :closable="false"
              />
            </el-row>
            <!-- 公司信息 -->
            <el-form label-width="120px">
              <el-form-item label="企业名称">
                <el-input v-model="companyInfo.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="companyInfo.companyPhone" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" disabled style="width: 400px" type="textarea" :rows="3" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 对话框 -->
      <el-dialog
        :title="rolesTitle"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <el-form ref="rolesRef" label-width="120px" :model="rolesInfo" :rules="rolesRules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="rolesInfo.name" style="width: 400px" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="rolesInfo.description" style="width: 400px" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <!-- <span slot="footer" class="dialog-footer"> -->
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button type="primary" size="small" @click="updateRoles">确 定</el-button>
          <!-- </span> -->
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 引入角色信息的接口
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRoles } from '@/api/setting'
// 引入vuex的辅助函数
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 分页的条件
      page: {
        page: 1,
        pagesize: 3,
        total: 0
      },
      // 公司信息的数据列表
      companyInfo: {},
      // 对话框的显示与隐藏
      dialogVisible: false,
      // 角色的信息
      rolesInfo: {
        name: '',
        description: ''
      },
      // 更新角色的校验
      rolesRules: {
        name: [
          { required: true, trigger: 'blur', message: '角色名称不能为空' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    rolesTitle() {
      return this.rolesInfo.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色信息
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.rolesList = rows
    },
    // 分页
    changePage(newpage) {
      this.page.page = newpage
      this.getRoleList()
    },
    // 获取公司的信息
    async getCompanyInfo() {
      const data = await getCompanyInfo(this.companyId)
      this.companyInfo = data
    },
    // 删除角色
    async removeRoles(rolesId) {
      try {
        await this.$confirm('确定要删除该角色吗？')
        await deleteRole(rolesId.id)
        this.$message.success('删除成功')
        this.getRoleList()
      } catch (error) {
        this.$message.info('您取消了该操作')
      }
    },
    // 根据id获取角色信息并弹框
    async editRoles(rolesId) {
      // 获取角色信息
      this.rolesInfo = await getRoleDetail(rolesId.id)
      this.dialogVisible = true
    },
    // 更新角色
    updateRoles() {
      this.$refs.rolesRef.validate(async isOk => {
        if (isOk) {
          if (this.rolesInfo.id) {
            await updateRole(this.rolesInfo)
          } else {
            await addRoles(this.rolesInfo)
          }
          this.$message.success('操作成功')
          this.getRoleList()
          this.dialogVisible = false
        } else {
          this.$message.error('角色名称不能为空')
          return
        }
      })
    },
    // 关闭对话框重置数据
    cancel() {
      this.rolesInfo = {
        name: '',
        description: ''
      }
      this.$refs.rolesRef.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style>

</style>
