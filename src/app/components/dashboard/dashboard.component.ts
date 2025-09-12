
import { CommonModule } from "@angular/common";
import { Component, computed, signal, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

export type nodeChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
}




import { CardModule } from 'primeng/card';

import { ProgressBarModule } from 'primeng/progressbar';
import { ReusablemodulesComponent } from "../shared/reusablemodules/reusablemodules.component";
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReusablemodulesComponent, NgApexchartsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {




  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild('nodeChart') nodeChart!: ChartComponent;


  public chartOptions!: any;
  public nodeChartOptions!: any;

  public secondChart!: any;
  public pieChart!: any;
  public lastChartOption!: any;
  selectedPeriod: string = "Last 6 Months";
  lastSixMonths: string[] = [];
  lastThreeMonths: string[] = [];
  // productNames: any[] = []
  productLeadsCount: any[] = []
  orgTypeData: any[] = [];

  selectedYears: string = 'Select Year';
  selectedOrgType: any = 'Select Org Type';
  years: number[] = [];

  totalLeadCount = signal<number>(0);
  totalGoemCount = signal<number>(0);
  totalKgdCount = signal<number>(0);
  totalNodesCount = signal<number>(0);
  totalPresentationCount = signal<number>(0);
  totalCataloguesCount = signal<number>(0);

  monthwiseLeads = signal<any[]>([]);
  topFiveLeadsProduct = signal<any[]>([]);
  top_Five_Performers = signal<any[]>([]);
  zoneWiseData = signal<any[]>([]);

  // monthsNames = signal<any[]>([]);
  monthNames: any[] = [];
  monthLeadsCount: any[] = []
  // monthLeadCounts = signal<any[]>([]);


  months: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  selectedMonth: string = this.months[new Date().getMonth()];

  selectMonth(month: string) {
    this.selectedMonth = month;
  }

  constructor(private commonService: CommonService) {


    this.chartOptions = {


      series: [
        {
          name: "Lead Generation count",
          data: this.monthLeadsCount,
          color: "#19988B"

        }
      ],
      chart: {
        type: "bar",
        height: 200
      },
      colors: ["#19988B"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 0.5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Augest",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
      },

      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#19988B"],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "#19988B",
              opacity: 1
            },
            {
              offset: 100,
              color: "#FFFFFF",
              opacity: 1
            }
          ]
        }
      },

      tooltip: {},
      legend: {

        markers: {
          width: 14,
          height: 8,
          radius: 2
        }
      }
    };




    this.secondChart = {
      series: [
        {
          name: "Sales Representative",
          data: [44, 55, 57, 56, 61, 58],
          color: "#19988B"
        },
        {
          name: "GOEM",
          data: [76, 85, 101, 98, 87, 105],
          color: "#C5DEDB"

        }
      ],
      chart: {
        type: "bar",
        height: 200
      },
      colors: ["#19988B", "#C5DEDB"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      },

      fill: {
        opacity: 1
      },
      tooltip: {},
      legend: {

        markers: {
          width: 14,
          height: 8,
          radius: 2
        }
      },
      grid: {
        show: false
      }
    };




    this.pieChart = {
      series: [0],
      chart: {
        type: "donut",
        width: 350,
        height: 200
      },
      // labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      labels: ["Loading..."],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 180,
              height: 2000
            },
            legend: {
              position: "top",
              horizontalAlign: 'left',

            }
          }
        }
      ]
    };


    this.lastChartOption = {
      series: [
        {
          name: "Leads",
          data: [95, 85, 90, 75, 100]
        }
      ],
      chart: {
        type: "bar",
        height: 220
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: false
      },
      xaxis: {
        categories: ["Zone1", "Zone2", "Zone3", "Zone4", "Zone5"]
      },
      yaxis: {
        title: {
          text: "Leads"
        }
      },
      fill: {
        type: "pattern",
        pattern: {
          style: "slantedLines",
          width: 8,
          height: 8,
          strokeWidth: 2,
          color: "#647E64"
        }
      },
      colors: ["#D6E6E6"],

    };


    this.nodeChartOptions = {
      series: [
        {
          name: "Lead Generation count",
          data: [],
          color: "#19988B"
        }
      ],
      chart: {
        type: "bar",
        height: 220
      },
      colors: ["#19988B"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 0.5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [],
        labels: {
          rotate: -45,
          style: {
            fontSize: '9px',
            fontWeight: 200,
            colors: ['#555']
          },
          trim: false
        },
        tooltip: {
          enabled: true
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#19988B"],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "#19988B",
              opacity: 1
            },
            {
              offset: 100,
              color: "#FFFFFF",
              opacity: 1
            }
          ]
        }
      },
      tooltip: {},
      legend: {
        markers: {
          width: 14,
          height: 8,
          radius: 2
        }
      }
    };



    //   this.nodeChartOptions = {


    //   series: [
    //     {
    //       name: "Lead Generation count",
    //       data: this.monthLeadsCount,
    //       color: "#19988B"

    //     }
    //   ],
    //   chart: {
    //     type: "bar",
    //     height: 200
    //   },
    //   colors: ["#19988B"],
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "20%",
    //       borderRadius: 5,
    //       borderRadiusApplication: "end",
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     show: true,
    //     width: 0.5,
    //     colors: ["transparent"],
    //   },
    //   xaxis: {
    //     categories: [

    //     ],
    //   },

    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shade: "light",
    //       type: "vertical",
    //       shadeIntensity: 0.5,
    //       gradientToColors: ["#19988B"],
    //       inverseColors: false,
    //       opacityFrom: 1,
    //       opacityTo: 1,
    //       stops: [0, 100],
    //       colorStops: [
    //         {
    //           offset: 0,
    //           color: "#19988B",
    //           opacity: 1
    //         },
    //         {
    //           offset: 100,
    //           color: "#FFFFFF",
    //           opacity: 1
    //         }
    //       ]
    //     }
    //   },

    //   tooltip: {},
    //   legend: {

    //     markers: {
    //       width: 14,
    //       height: 8,
    //       radius: 2
    //     }
    //   }
    // };

  }



  getLastMonths(count: number) {
    let today = new Date();
    let monthsArray = [];

    for (let i = 0; i < count; i++) {
      let monthIndex = (today.getMonth() - i + 12) % 12;
      monthsArray.push(this.months[monthIndex]);
    }

    if (count === 6) {
      this.lastSixMonths = monthsArray;
    } else if (count === 3) {
      this.lastThreeMonths = monthsArray;
    }
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
  }



  ngOnInit(): void {
    this.generateLastYears();
    const currentYear = new Date().getFullYear();
    this.getOrgType();
    this.getLeadsData(currentYear);
  }



  generateLastYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  }
  selectYears(year: number,) {
    console.log(year, 'year---->');
    this.selectedYears = year.toString();
    console.log('here is selected year', this.selectedYears);

    // Pass org_type_id if provided, else undefined
    this.getLeadsData(year);
  }

  selectOrgType(org_type_id: any) {

    console.log(org_type_id, 'org_type_id---->');
    const currentYear = new Date().getFullYear();
     this.selectedOrgType = org_type_id;
    // Pass org_type_id if provided, else undefined
    this.getLeadsData(currentYear, this.selectedOrgType);
  }

  getLeadsData(year: any, org_type_id?: any) {
    console.log(year, 'here yearwise called api');
    let id;
    if (org_type_id !== undefined && org_type_id !== null) {
      id = org_type_id;
    } else {
      id = this.orgTypeData[1]?.id;
    }

    const payload = { year, id: id ?? null };


    this.commonService.postDataWithBody('api/dashboard/getCountsForDashboard', payload).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.totalLeadCount.set(+res.total_leads_count?.[0]?.count || 0);
          this.totalGoemCount.set(+res.total_goem_count?.[0]?.total_count || 0);
          this.totalKgdCount.set(+res.total_kgd_count?.[0]?.total_count || 0);
          this.totalNodesCount.set(+res.total_nodes_count?.[0]?.count || 0);
          this.totalPresentationCount.set(+res.total_presentation_count?.[0]?.count || 0);
          this.totalCataloguesCount.set(+res.total_catalogues_count?.[0]?.count || 0);
          this.monthwiseLeads.set(res.total_lead_monthwise_count || []);
          this.topFiveLeadsProduct.set(res.top5_leads_product || []);
          this.top_Five_Performers.set(res.top5_performer || []);
          console.log(this.topFiveLeadsProduct(), 'here is top5leads products');

          this.zoneWiseData.set(res.zoneWiseData || []);

          const zonewiseCounts = res.zoneWiseData || [];

          this.monthNames = res.total_lead_monthwise_count?.[0]?.months || 0
          console.log(this.zoneWiseData, 'here is zone wise');
          console.log('here is the zoneWiseData', this.zoneWiseData);

          this.monthLeadsCount = res.total_lead_monthwise_count?.[0]?.leads || 0
          console.log(this.monthLeadsCount, 'here are monthLeadsCount');

          const monthlyData = res.total_lead_monthwise_count || [];
          this.zoneWiseData.set(res.zoneWiseData || {});
          this.updatePieChartFromZoneWiseData(res.zoneWiseData || {});

          this.updateChartDataFromMonthlyLeads(monthlyData)
          this.updateNodeChartOptionsFromTopProducts();
          this.updatePieChartFromZoneWiseData(zonewiseCounts);
       this.updateBarChartData(res.top5_performer || []);


        }
      }
    })
  }

  private getCurrentMonthName(): string {
    return new Date().toLocaleString('default', { month: 'short' });
  }


  currentMonthLeadCount = computed(() => {
    const month = this.getCurrentMonthName();
    const monthwise = this.monthwiseLeads();
    const entry = monthwise.find(m => m.month === month);
    return entry ? +entry.leads : 0;
  });


  updateChartDataFromMonthlyLeads(monthlyData: any[]): void {
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap = new Map(monthlyData.map((item: any) => [item.month, +item.leads]));

    this.monthNames = allMonths;
    this.monthLeadsCount = allMonths.map(month => monthMap.get(month) || 0);

    this.chartOptions.series[0].data = this.monthLeadsCount;
    console.log('her month leads count', this.monthLeadsCount);
    console.log('here month leads count--------->', this.chartOptions.series[0].data);
    this.chartOptions.xaxis.categories = this.monthNames;


    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          ...this.chartOptions.series[0],
          data: [...this.monthLeadsCount]
        }
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: [...this.monthNames]
      }
    };

    console.log('Chart updated with new data:', this.chartOptions.series[0].data);


  }



  updateNodeChartOptionsFromTopProducts() {
    const topProducts = this.topFiveLeadsProduct();
    const productNames = topProducts.map(p => p.product_name);
    const leadCounts = topProducts.map(p => +p.lead_count);

    this.nodeChartOptions = {
      ...this.nodeChartOptions,
      series: [
        {
          name: "Lead Generation count",
          data: leadCounts,
          color: "#19988B"
        }
      ],
      xaxis: {
        ...this.nodeChartOptions.xaxis,
        categories: productNames,
        labels: {
          rotate: -15,
          style: {
            fontSize: '9px',
            fontWeight: 300,
            colors: ['#555']
          },
          trim: false
        },
        tooltip: {
          enabled: true
        }
      }
    };


    setTimeout(() => {
      this.nodeChart?.updateOptions(this.nodeChartOptions, true, true);
    }, 0);
  }

  updatePieChartFromZoneWiseData(zonewiseCounts: any): void {
    // Convert object to array of { name, count }
    const entries = Object.entries(zonewiseCounts).map(([name, count]) => ({
      name,
      count: Number(count)
    }));

    const labels = entries.map(z => z.name);
    const series = entries.map(z => z.count);

    // Update the existing chart config (mutate instead of replace)
    this.pieChart.labels = labels;
    this.pieChart.series = series;
  }


updateBarChartData(topFivePerformers: any[]): void {
  const labels = topFivePerformers.map(p => p.name);
  const series = topFivePerformers.map(p => Number(p.lead_count));

  this.lastChartOption = {
    ...this.lastChartOption,
    series: [
      {
        name: 'Leads',
        data: series
      }
    ],
    xaxis: {
      categories: labels
    }
  };
}



  ngAfterViewInit() {
    this.updateNodeChartOptionsFromTopProducts();
    this.updatePieChartFromZoneWiseData(this.zoneWiseData());
  }


  getOrgType() {
    this.commonService.getAllData('api/user/getOrgType').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.orgTypeData = res.data
          console.log('here are org', this.orgTypeData);

        } else {

          console.log('Invalid ', res);
        }

      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }


}

