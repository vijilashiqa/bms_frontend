import { Component, OnInit } from '@angular/core';
import { BusinessService, CustService, ResellerService, RoleService, UserLogService, PagerService } from '../../_service/indexService';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import * as JSXLSX from 'xlsx';
const EXCEL_EXTENSION = '.xlsx';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'ngx-share-log',
  templateUrl: './share-log.component.html',
  styleUrls: ['./share-log.component.scss']
})
export class ShareLogComponent implements OnInit {
  submit: boolean = false;
  pager: any = {}; page: number = 1; pagedItems: any = []; limit: number = 25; total;
  bus; resel; bus_name; resel_name; data; count; search;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;
  constructor(
    public role: RoleService,
    private busSrv: BusinessService,
    private reselSrv: ResellerService,
    private log: UserLogService,
    private pageservice: PagerService,
    private datepipe: DatePipe,
  ) { }

  async ngOnInit() {
    await this.list();
    await this.showBusiness();
    if (this.role.getroleid() <= 777) {
      this.bus_name = this.role.getispid()
      await this.showReseller();
     }
  }

  async showBusiness($event = '') {
    this.bus = await this.busSrv.showBusName({ like: $event });
  }
  async showReseller($event = '') {
    this.resel = await this.reselSrv.showResellerName({ bus_id: this.bus_name, role: 333, like: $event })
  }
   


  async list() {
    this.loading = true;
    let result = await this.log.resellerShareLog({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      resel_id: this.resel_name,
    });

    if (result) {
      this.loading = false
      for (let i in result[0]) {
        let item = JSON.parse(result[0][i]['data'])
        result[0][i]['share'] = item
      }
      this.data = result[0];
      console.log('Data', this.data);

      this.count = result[1]['count'];
      this.setPage();
    } else this.loading = false;
  }

  async refresh() {
    this.bus_name = ''; this.resel_name = '';
    this.list();
  }

  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.list();
    }
  }

  downloadFile(filename, man) {
    this.log.downloadFile({ filename: filename }).subscribe(response => {
      console.log('Response', response);
      let blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      console.log('Blob', blob)
      fileSaver.saveAs(blob, `${man}_UpdatedShare.xlsx`)
        , async (error) => {
          const message = JSON.parse(await error.error.text()).message;
        },

        () => console.log('File downloaded successfully')
    });


  }

  setPage() {
    // console.log(this.data);
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }

  async download() {
    this.loading = true;
    let res = await this.log.resellerShareLog({
      bus_id: this.bus_name,
      resel_id: this.resel_name,
    })
    if (res) {
      this.loading = false;
      for (let i in res[0]) {
        let item = JSON.parse(res[0][i]['data'])
        res[0][i]['share'] = item
      }
      let tempdata = [], temp: any = res[0];
      for (var i = 0; i < temp.length; i++) {
        let param = {};
        param['ID'] = temp[i]['id']
        if (this.role.getroleid() > 777) param['BUSINESS'] = temp[i]['busname'];

        param['RESELLER'] = temp[i]['company'];
        param['FROM SHARETYPE'] = temp[i]['share']['oldshare_type'] == 1 ? 'COMMON' : 'PACKAGE WISE';
        param['FROM ISPSHARE'] = temp[i]['share']['oldisp_share'] + "%" || '--';
        param['FROM SUBISPSHARE'] = temp[i]['share']['oldsubisp_share'] + "%" || '--';
        param['FROM SUBDISTSHARE'] = temp[i]['share']['oldsubdist_share'] + "%" || '--';
        param['FROM RESELLERSHARE'] = temp[i]['share']['oldresel_share'] + "%" || '--';

        param['TO SHARETYPE'] = temp[i]['share']['newshare_type'] == 1 ? 'COMMON' : 'PACKAGE WISE';
        param['TO ISPSHARE'] = temp[i]['share']['newisp_share'] + "%" || '--';
        param['TO SUBISPSHARE'] = temp[i]['share']['newsubisp_share'] + "%" || '--';
        param['TO SUBDISTSHARE'] = temp[i]['share']['newsubdist_share'] + "%" || '--';
        param['TO RESELLERSHARE'] = temp[i]['share']['newresel_share'] + "%" || '--';

        param['UPDATED_BY'] = temp[i]['managername'];
        param['UPDATED_DATE'] = this.datepipe.transform(temp[i]['cdate'], 'dd-MM-yyyy hh:mm:ss a', 'es-ES');;

        tempdata[i] = param
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Updated_share_log' + EXCEL_EXTENSION);
    } else this.loading = false;
  }

}
