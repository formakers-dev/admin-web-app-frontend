<template>
  <div>
    <h1 class="title">게임 플레이 시간 조회</h1>

    <div class="content">
      <b-field style="width: 100% !important;">
        <b-select v-model="searchKey">
          <option v-for="option in options.types" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </b-select>
        <b-input v-model="value"
                 style="width: 100%"></b-input>
        <button class="button is-primary"
                style="height: 100%"
                @click="search"
                :disabled="!!!value || value.length === 0"
        >검색
        </button>
      </b-field>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>

      <div v-if="appUsageList.length > 0">
        플레이 인원수 : {{ getUserCount() }} 명,
        총 플레이 시간 : {{ convertDuration(getTotalPlayTime()) }},
        1인당 평균 플레이 시간 : {{ convertDuration(getAveragePlayTime()) }}
      </div>
      <b-table
        ref="table"
        :data="appUsageList"
        :bordered="false"
        :hoverable="true"
        :show-detail-icon="true"
        default-sort="date"
        default-sort-direction="desc"
        detail-key="_id"
        detailed
        selectable
      >
        <template slot-scope="props">
          <b-table-column field="userId" label="유저ID" searchable>
            <div style="font-size: 0.8rem">
              {{ props.row.userId }}
            </div>
          </b-table-column>

          <b-table-column field="genderString" label="성별" searchable>
            {{ props.row.genderString }}
          </b-table-column>

          <b-table-column field="ageRange" label="나이대" searchable>
            {{ props.row.ageRange }}
          </b-table-column>

          <b-table-column field="appName" label="앱" searchable>
            <div style="font-size: 0.8rem">
              <img :src="props.row.iconUrl" width="30"/>
              {{ props.row.appName }}
            </div>
          </b-table-column>

          <b-table-column field="date" label="날짜" searchable sortable>
            {{ convertDateFormat(props.row.date) }}
          </b-table-column>

          <b-table-column field="totalUsedTime" label="플레이 시간" sortable>
            {{ convertDuration(props.row.totalUsedTime) }}
          </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <div class="box">
            {{ props.row }}
          </div>
        </template>

        <template slot="empty">
          <section v-if="!isLoading" class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon
                  icon="emoticon-sad"
                  size="is-large">
                </b-icon>
              </p>
              <p>데이터가 없습니다</p>
            </div>
          </section>
        </template>
      </b-table>

    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import request from '../../common/utils/http';
  import timeUtil from '../../common/utils/time';
  import usersUtil from '../../common/utils/users';

  export default {
    name: 'app-usages',
    data() {
      return {
        appUsageList: [],
        isLoading: false,
        searchKey: this.appKey,
        options:{
          types:[
            {text:'게임명', value:'app_name'},
            {text:'패키지명', value:'package_name'},
          ]
        }
      };
    },
    props: {
      appKey: String,
      value: String,
    },
    created() {
      console.log('appKey=', this.appKey);
      if (!!!this.appKey) {
        this.searchKey = 'app_name';
      }
      console.log('searchKey=', this.searchKey);

      if (this.value) {
        this.loadAppUsages();
      }
    },
    methods: {
      search() {
        this.loadAppUsages();
      },
      loadAppUsages() {
        this.isLoading = true;
        const path = '/api/usages/game?' + this.searchKey + '=' + this.value;
        console.log(path);

        request.get(path)
          .then((res) => {
            console.log(res);
            this.appUsageList = res.data.map(appUsage => {
              appUsage.ageRange = usersUtil.convertBirthDayToAgeRange(appUsage.birthday);
              appUsage.genderString = usersUtil.convertGenderToString(appUsage.gender);
              return appUsage
            });
            this.isLoading = false;
          })
          .catch((err) => {
            console.log('err', err);

            let toastMsg;
            if (err.name === 'NavigationDuplicated') {
              toastMsg = '동일한 게임명 입니다';
            } else {
              toastMsg = '앱 사용 정보를 불러오는데 실패하였습니다.'
            }

            this.$buefy.toast.open({
              message: toastMsg,
              type: 'is-danger',
            });
            this.isLoading = false;
          });
      },
      convertDateFormat(date) {
        return moment(date).format('YYYY-MM-DD(ddd)');
      },
      convertDuration(ms) {
        return timeUtil.millisecondsToDuration(ms);
      },
      getTotalPlayTime() {
        return this.appUsageList.reduce((sum, appUsage) => {
            sum.value = sum.value + appUsage.totalUsedTime;
            return sum;
          }, {value: 0}
        ).value;
      },
      getUserCount() {
        return this.appUsageList.reduce((users, appUsage) => {
          if (!users.values.includes(appUsage.userId)) {
            users.values.push(appUsage.userId);
          }
          return users;
        }, { values: [] }).values.length;
      },
      getAveragePlayTime() {
        return this.getTotalPlayTime() / this.getUserCount();
      },
    },
  };
</script>

<style scoped>
</style>
