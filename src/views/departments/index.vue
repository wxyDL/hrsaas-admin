<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="depat-container">
        <!-- 组织架构头 -->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 组织架构树形结构 -->
        <el-tree :data="list" :props="defaultProps" :default-expand-all="true">
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDept="AddDept" @editDept="editDepts" />
        </el-tree>
      </el-card>
      <add-dept ref="deptsRef" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>
</template>

<script>
// 引入树形结构的组件
import TreeTools from './components/tree-tools.vue'
// 引入获取组织架构数据的接口给
import { getDepartments } from '@/api/departments'
// 引入递归算法转换成树形数据
import { tranListToTreeData } from '@/utils'
// 引入对话框的组件
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      // 树形结构的数据
      list: [],
      // 树形结构的默认配置
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      // 公司名称对象
      company: {
        name: '安徽旭陌科技有限公司',
        manager: '负责人',
        id: ''
      },
      // 显示对话框与否
      showDialog: false,
      // 点击部门的节点的数据
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取组织架构数据
    async getDepartments() {
      // 调用获取组织架构的接口
      const results = await getDepartments()
      this.list = tranListToTreeData(results.depts, '')
      console.log(results.depts)
    },
    // 添加部门
    AddDept(node) {
      // 显示对话框
      this.showDialog = true
      this.node = node
    },
    // 编辑部门
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.deptsRef.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.depat-container{
  padding: 30px 140px;
  font-size: 14px;
}
</style>
