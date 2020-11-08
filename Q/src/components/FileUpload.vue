<template>
  <div>
    <section class="content">
      <div class="row">
        <div class="col-md-12">
          <div class="box box-info">
            <!-- Input Addons -->
            <!--
              <div class="box-header with-border">
              <h3 class="box-title"></h3>
              </div>
            -->

            <div class="box-body">
              <!-- file upload -->
              <div class="input-group">
                <div class="upload">
                  <ul>
                    <li v-for="(file, index) in files" :key="file.id">
                      <span>{{file.name}}</span> -
                      <span>檔案大小 {{file.size | formatSize}}</span> -
                      <span v-if="file.error">{{file.error}}</span>
                      <span v-else-if="file.success">
                        上傳成功 - 每秒上傳速度 {{file.speed | formatSize}}
                      </span>
                      <span v-else-if="file.active">上傳中...</span>
                      <span v-else></span>
                    </li>
                  </ul>
                  <div class="example-btn">
                    <file-upload
                       class="btn btn-primary"
                       post-action="/api/fileUpload"
                       extensions="xlsx,xls"
                       :size="1024 * 1024 * 100"
                       v-model="files"
                       @input-filter="inputFilter"
                       @input-file="inputFile"
                       ref="upload">
                      <i class="fa fa-plus"></i>
                      選擇檔案 
                    </file-upload>
                    <q-btn color="secondary" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                      <i class="fa fa-arrow-up" aria-hidden="true"></i>
                      開始上傳
                    </q-btn>
                    <q-btn color="amber" v-else @click.prevent="$refs.upload.active = false">
                      <i class="fa fa-stop" aria-hidden="true"></i>
                      停止上傳
                    </q-btn>
                  </div>
                </div>
              </div>
              <hr size='5'/>
              <div class="input-group">
                <div>
                  <div class="example-btn">
                    <button type="button" class="btn btn-warning" v-on:click="uploadAllFiles">
                      <i class="fa fa-refresh" aria-hidden="true"></i>
                     立即匯入 
                    </button>
                  </div>
                </div>
              </div>
              <!-- /input-group -->
            </div>
            <!-- /.box-body -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import $ from 'jquery'
import FileUpload from 'vue-upload-component'
import filesize from 'filesize'

export default {
  components: {
    FileUpload
  },
  data () {
    return {
      files: []
    }
  },
  filters: {
    formatSize: function (value) {
      return filesize(value)
    }
  },
  methods: {
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile (newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        // console.log('add', newFile)
        // console.log(JSON.stringify(newFile, null, 2))
      }
      if (newFile && oldFile) {
        // update
        // console.log('update', newFile)
        // console.log(JSON.stringify(newFile, null, 2))
      }
      if (!newFile && oldFile) {
        // remove
        // console.log('remove', oldFile)
      }
    },
    uploadAllFiles: function () {
      if (confirm('是否匯入所有檔案?')) {
        $.ajax({
          type: 'POST',
          url: '/api/uploadAllFiles',
          data: {
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
