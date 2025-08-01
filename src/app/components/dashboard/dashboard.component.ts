
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

  selectedYears: string = 'Select Year';
  years: number[] = [];

  totalLeadCount = signal<number>(0);
  totalGoemCount = signal<number>(0);
  totalKgdCount = signal<number>(0);
  totalNodesCount = signal<number>(0);
  totalPresentationCount = signal<number>(0);
  totalCataloguesCount = signal<number>(0);

  monthwiseLeads = signal<any[]>([]);
  topFiveLeadsProduct = signal<any[]>([]);
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
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut",
        width: 350,
        height: 250
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],

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
    this.getLeadsData(currentYear);

  }



  generateLastYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  }

  selectYears(year: number): void {

    console.log(year, 'year---->');

    this.selectedYears = year.toString();
    console.log('here is selected year', this.selectYears);

    this.getLeadsData(year)
  }

  getLeadsData(year: any) {


    this.commonService.postDataWithBody('api/dashboard/getCountsForDashboard', { year }).subscribe({
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
          console.log(this.topFiveLeadsProduct(), 'here is top5leads products');

          this.zoneWiseData.set(res.zoneWiseData || []);
          this.monthNames = res.total_lead_monthwise_count?.[0]?.months || 0
          console.log(this.monthNames, 'here are month');
          this.monthLeadsCount = res.total_lead_monthwise_count?.[0]?.leads || 0
          console.log(this.monthLeadsCount, 'here are monthLeadsCount');

          const monthlyData = res.total_lead_monthwise_count || [];
         this.updateChartDataFromMonthlyLeads(monthlyData)
        this.updateNodeChartOptionsFromTopProducts();


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
    this.chartOptions.xaxis.categories = this.monthNames;
  }

updateNodeChartOptionsFromTopProducts() {
  const topProducts = this.topFiveLeadsProduct(); // get signal value
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
}

ngAfterViewInit() {
  this.updateNodeChartOptionsFromTopProducts();
}

}
