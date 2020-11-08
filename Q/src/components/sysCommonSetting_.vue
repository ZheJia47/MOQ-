<template>
<div class="layout-padding">
  <section class="content">
    <div class="row center-block">
      <q-list>
        <q-item>
          <q-item-side left>
          <h5>系統共用資料設定</h5>
          </q-item-side>
          <q-item-main>
          </q-item-main>
          <q-item-side right>
          <q-btn label="確定" @click="save" color="black" :push="true"/>
        </q-item-side>
        </q-item>
      <q-item>
      <q-table
        :data="rows"
        :columns="columns"
        :rows-per-page-options="options"
        :selected-rows-label="sel()"
        :pagination.sync="serverPagination"
        separator="cell"
        row-key="name"
        color="amber"
        hide-header
        @refresh="refresh"
        @rowclick="rowclick"
      >
       <tr slot="header" slot-scope="props" >
        <q-th v-for="col in columns" v-bind:key="col.name" :props="props" v-if="col.rowMerge===false" >
          <span :rowspan="2">
          {{col.label}}
          <q-tooltip>{{col.label}}</q-tooltip>
          </span>
        </q-th>
        <q-th  v-else-if="col.rowMerge===true">
          <q-tr v-if=" col.firstFontCol===true">
            123456
          </q-tr>
          <q-tr>
            {{col.label}}
            </q-tr>
        </q-th>
        </tr>
        <tr slot="header" slot-scope="props" >
        <q-th v-for="col in columns" v-bind:key="col.name" :props="props" v-if="col.rowMerge===false" >
          <span :rowspan="2">
          {{col.label}}
          <q-tooltip>{{col.label}}</q-tooltip>
          </span>
        </q-th>
        <q-th  v-else-if="col.rowMerge===true">
          <q-tr v-if=" col.firstFontCol===true">
            123456
          </q-tr>
          <q-tr>
            {{col.label}}
            </q-tr>
        </q-th>
        </tr>
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td v-if="props.row.__index===0" key="paramName" :props="props" :rowspan="2">
            {{props.row.paramName}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="paramName" :props="props">
            <!--<q-chip small square color="amber">-->
              {{props.row.paramName}}
          </q-td>

          <q-td v-if="props.row.__index===0" key="action" :props="props" :rowspan="2">
            {{props.row.action}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="action" :props="props">
            <div color="blue" style="min-width: 100px">
            {{ props.row.action}}
            </div>
          </q-td>

          <q-td v-if="props.row.__index===0" key="condition" :props="props" :rowspan="2">
            {{props.row.condition}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="condition" :props="props" class="text-red">{{ props.row.condition }}</q-td>

          <q-td v-if="props.row.__index===0" key="fontBackground" :props="props" :colspan="6">
            {{props.row.fontBackground}}
          </q-td>
          <q-td v-else-if="props.row.__index===1" key="fontBackground" :props="props">
            {{props.row.fontBackground}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBackground" :props="props"  color="amber">
            <q-color
              :style="props.row['fontBackground' + 'Style']"
              v-model="props.row['fontBackground']"
              display-value=" "
              :change="setColor(props, 'fontBackground')"
            />
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontSized" :props="props">
            {{props.row.fontSized}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontSized" :props="props"  color="amber">
            <q-input v-model="props.row['fontSized']"  type="number" align="center" :style="props.row['fontSized' + 'Px']" :change="setSize(props, 'fontSized')" :max="30" :min="2">
            </q-input>
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontColor" :props="props"  color="amber">{{props.row.fontColor}}</q-td>
          <q-td v-else-if="props.row.__index>1" key="fontColor" :props="props"  color="amber">
            <q-color
              :style="props.row['fontColor' + 'Style']"
              v-model="props.row['fontColor']"
              display-value=" "
              :change="setColor(props, 'fontColor')"
            />
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontBold" :props="props">
            {{props.row.fontBold}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBold" :props="props"  color="amber">
            <q-btn label="B" v-if="props.row['fontBold']" @click="fontBoldClick(props, 'fontBold')" style="fontWeight: bold" :push="true"/>
            <q-btn v-else label="B" @click="fontBoldClick(props, 'fontBold')" :push="true"/>
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontItalic" :props="props">
            {{props.row.fontItalic}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontItalic" :props="props"  color="amber">
            <q-btn label="I" v-if="props.row['fontItalic']" @click="fontBoldClick(props, 'fontItalic')" style="fontStyle: italic" :push="true"/>
            <q-btn v-else label="I" @click="fontBoldClick(props, 'fontItalic')" :push="true"/>
          </q-td>

          <q-td v-if="props.row.__index===1" key="fontBlink" :props="props">
            {{props.row.fontBlink}}
          </q-td>
          <q-td v-else-if="props.row.__index>1" key="fontBlink" :props="props"  color="amber">
            <q-btn v-if="props.row['fontBlink']" @click="fontBoldClick(props, 'fontBlink')"  :push="true">
              <span class="blink">S</span>
            </q-btn>
            <q-btn v-else @click="fontBoldClick(props, 'fontBlink')" :push="true">
              <span>S</span>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
      </q-table>
      </q-item>
      </q-list>
    </div>
  </section>
</div>
</template>

<script>
// import $ from 'jquery'        :dense="true"
// import moment from 'moment'
// import 'moment-duration-format'
// import orderNumber from './OrderNumberEdit'
// import moldNum from './MoldNumberEdit'
// var _ = require('underscore')._

export default {
  data: function () {
    return {
      brand: 'red',
      modelHexBg: '',
      modelHex: '',
      rows: [
        {
          paramName: '參數名稱',
          action: '動作',
          condition: '參數條件',
          fontBackground: '字型'
        },
        {
          fontBackground: '底色',
          fontSized: '大小',
          fontColor: '色彩',
          fontBold: '粗體',
          fontItalic: '斜體',
          fontBlink: '閃爍'
        },
        {
          paramName: '當日警報次數上限',
          action: '字型變化',
          condition: '>5',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '連續成品料號生產，提示分割派單用之派單模次係數',
          action: '跳出派單之累計模數提示框',
          condition: '>1.03',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '週期效率',
          action: '字型變化',
          condition: '>99%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '週期效率',
          action: '字型變化',
          condition: '<97%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '不良率(非單一成品料號)',
          action: '字型變化',
          condition: '>3%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        },
        {
          paramName: '稼動率',
          action: '字型變化',
          condition: '<50%',
          fontBackground: '',
          fontBackgroundStyle: '',
          fontSized: '',
          fontSizedPx: '',
          fontColor: '',
          fontColorStyle: '',
          fontBold: false,
          fontItalic: false,
          fontBlink: false
        }
      ],
      columns: [
        {
          label: '參數名稱',
          field: 'paramName',
          name: 'paramName',
          align: 'left',
          width: '1000px',
          color: 'amber',
          rowMerge: false,
          firstFontCol: false,
          filter: true
        },
        {
          label: '動作',
          field: 'action',
          name: 'action',
          align: 'center',
          width: '70px',
          rowMerge: false,
          firstFontCol: false,
          style: {color: 'red'},
          filter: true
        },
        {
          label: '參數條件',
          field: 'condition',
          name: 'condition',
          align: 'center',
          width: '70px',
          rowMerge: false,
          firstFontCol: false,
          filter: true
        },
        {
          label: '底色',
          field: 'fontBackground',
          name: 'fontBackground',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: true,
          filter: true
        },
        {
          label: '大小',
          field: 'fontSized',
          name: 'fontSized',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '色彩',
          field: 'fontColor',
          name: 'fontColor',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '粗體',
          field: 'fontBold',
          name: 'fontBold',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '斜體',
          field: 'fontItalic',
          name: 'fontItalic',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        },
        {
          label: '閃爍',
          field: 'fontBlink',
          name: 'fontBlink',
          align: 'center',
          width: '200px',
          rowMerge: true,
          firstFontCol: false,
          filter: true
        }
      ],
      serverPagination: {
        page: 1,
        rowsPerPage: 200,
        rowsNumber: 20 // specifying this determines pagination is server-side
      },
      options: [
        20, 50, 100, 200, 500
      ]
    }
  },
  methods: {
    sel () {

    },
    rowclick (event) {
      // console.log(event)
    },
    refresh (done) {
      // console.log('refresh')
      setTimeout(() => {
        done()
      }, 3000)
    },
    setColor (newValue, key) {
      newValue.row[key + 'Style'] = 'background-color:' + newValue.row[key]
    },
    setSize (newValue, key) {
      newValue.row[key + 'Px'] = 'fontSize:' + newValue.row[key] + 'px'
    },
    fontBoldClick (newValue, fontBold) {
      newValue.row[fontBold] = !newValue.row[fontBold]
      console.log(fontBold)
    },
    save () {
      console.log(this.rows)
    }
  }
}
</script>
<style lang="stylus">
.blink {
    animation: blink .9s linear infinite;
    -webkit-animation: blink .9s linear infinite;
    -moz-animation: blink .9s linear infinite;
    -ms-animation: blink .9s linear infinite;
    -o-animation: blink .9s linear infinite;
    color: #dd4814;
}

@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-webkit-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-moz-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-ms-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}
@-o-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
}

</style>
