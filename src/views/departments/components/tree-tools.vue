<template>
  <el-row type="flex" justify="space-between" style="width: 100%" align="middle">
    <el-col>
      <span>
        {{ treeNode.name }}
      </span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          {{ treeNode.manager }}
        </el-col>
        <el-dropdown @command="handleCommand">
          <span>
            操作
            <i class="el-icon-arrow-down" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">
              添加子菜单
            </el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="del">
              删除菜单
            </el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="edit">
              编辑菜单
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 引入删除部门的接口
import { delDepartments } from '@/api/departments'
export default {
  name: '',
  components: {},
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleCommand(command) {
      if (command === 'add') {
        // 添加部门
        this.$emit('addDept', this.treeNode)
      } else if (command === 'edit') {
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除部门
        this.$confirm('确定要删除该部门吗？').then(() => {
          //   返回Promise对象
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 触发自定义事件，子传父
          this.$emit('delDepts')
          this.$message.success('删除成功')
        })
      }
    }
  }
}
</script>

<style scoped lang = "less">

</style>
