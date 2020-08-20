<template>
  <div>
    <h1 class="title">게임 플레이 시간 조회</h1>

    <b-table
      ref="table"
      :data="appUsageList"
      :bordered="false"
      :hoverable="true"
      :show-detail-icon="true"
      default-sort="date"
      default-sort-direction="desc"
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
            {{ props.row.appName }}</div>
        </b-table-column>

        <b-table-column field="date" label="날짜" searchable sortable>
          {{ convertDateFormat(props.row.date) }}
        </b-table-column>

        <b-table-column field="totalUsedTime" label="플레이 시간" sortable>
          {{ convertDuration(props.row.totalUsedTime) }}
        </b-table-column>
      </template>

      <template slot="empty">
        <section v-if="!$root.isLoading" class="section">
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
      };
    },
    created() {
      this.loadAppUsages();
    },
    methods: {
      loadAppUsages() {
        request.get('/api/usages/game')
          .then((res) => {
            console.log(res);
            this.appUsageList = res.data.map(appUsage => {
              appUsage.ageRange = usersUtil.convertBirthDayToAgeRange(appUsage.birthday);
              appUsage.genderString = usersUtil.convertGenderToString(appUsage.gender);
              return appUsage
            });
          })
          .catch((err) => {
            this.$buefy.toast.open({
              message: '앱 사용 정보를 불러오는데 실패하였습니다.',
              type: 'is-danger',
            });
            console.log(err.response);
          });
      },
      convertDateFormat(date) {
        return moment(date).format('YYYY-MM-DD(ddd)');
      },
      convertDuration(ms) {
        return timeUtil.millisecondsToDuration(ms);
      }
    },
  };
</script>

<style scoped>
</style>
