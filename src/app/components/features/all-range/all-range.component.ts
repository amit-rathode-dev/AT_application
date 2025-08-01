import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CommonService } from '../../../services/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

interface GensetCard {
  category: string;
  title: string; // e.g., "LHP"
  image: string;
  fuel: string;
  kvaList: { id: number; value: string }[]; 
}

@Component({
  selector: 'app-all-range',
  standalone: true,
  imports: [CommonModule ,CardModule,TooltipModule,DropdownModule ,FormsModule,ReactiveFormsModule],
  templateUrl: './all-range.component.html',
  styleUrl: './all-range.component.css'
})
export class AllRangeComponent {
  environment=environment.apiUrl
  fuelFilters:any = [];
  selectedFuels:any = [];
dropdownData:any=[]
selectedCategory!:number;
allProductListData:any=[]
categoryOptions:any=[]
selectedRange:any=[]
rangeOptions:any=[]
selectedNode: any;
nodeOptions:any
  gensetList:any = [];
catId:any
fuelId:any
fuels:any
  constructor(private commonService:CommonService ,private route: ActivatedRoute,private router:Router){}
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
       this.catId = +params['catId'] || 0;
       this.fuelId = +params['fuelId'] || 0;
      //  this.fuels = (params['fuels'] || '').split(',').filter((f: string) => f); // Converts string to array
      //  console.log("sfdsfds",this.fuels);
      //  this.selectedFuels=[...this.fuels]
  
      // Call your data fetching method
  
    })
    this.selectedCategory=this.catId
this.getDropdownList(this.catId,this.fuelId);
this.getallFuel();
this.getCategoriesData()
  }


  getallFuel() {
    const url = 'api/categories/getAllFuel';
   
  
    this.commonService.getAllData(url).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.message === 'Data Found') {
        //  console.log((res.data));
         this.fuelFilters=res.data
        //  this.selectedFuels = this.fuelFilters.map((fuel: any) => fuel.name);
        
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  
  getDropdownList(id: number , fuel_id: number) {
    const url = `api/categories/getProducts?id=${id}&fuel_id=${fuel_id}`;
    this.commonService.getAllData(url).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.message === 'Data Found') {
          this.gensetList = res.data;

          // console.log("qwfqygu",this.gensetList);
          const nodes: any[] = [];
const fuelFilter:any=[]
this.gensetList.forEach((category: any) => {
  // console.log('category',category);
  
  if (Array.isArray(category.fuel)&& category.isactive) {

    // console.log('category11111',category);
    category.fuel.forEach((fuel: any) => {

      if (fuel.name && !fuelFilter.includes(fuel.name)) {
        fuelFilter.push(fuel.name);
      }
   
      
      if (Array.isArray(fuel.ranges)) {
        fuel.ranges.forEach((range: any) => {
          if (Array.isArray(range.nodes)) {
            range.nodes.forEach((node: any) => {
              if (node.isactive) {
                nodes.push({
                  label: node.value,
                  value: node.id
                });
              }
            });
          }
        });
      }
    });
  }
});

// console.log("fuels",fuelFilter);
this.selectedFuels=[...fuelFilter]
this.nodeOptions = nodes;

      }
      },
      error: (err: any) => {
        console.error('Error fetching product data:', err);
      },
    });
    
  }


  getCategoriesData() {
    const url = 'api/categories/getCategories';
    const params = { category_type_id: 0 };
  
    this.commonService.getAllDatawithpathVariable(url, params).subscribe({
      next: (res: any) => {
        // console.log('categoriesData',res);
        const categoiesData:any=res.data
        const data:any=[]
        if (res.status === 200 && res.message === 'Data Found') {
          data.push({
            label: 'All Range',
            value: 0   // or null, depending on your logic
          });
          categoiesData.forEach((category: any) => {
         
            
          if(category.isactive){
            // console.log('11111111',category);
             data.push({
                label: `${category.name} (${category.lowRange}- ${category.highRange} kVA)`,
                value: category.id,
                 
                
              });
            }
            });
        this.categoryOptions=data
      
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
// 93473

   // return this.gensetList.filter(gen => this.selectedFuels.includes(gen.fuel));

   onNodeChange(id:any){
    const node_id=id.value
    this.selectedNode = node_id


   }
  onCategoryChange(id:any) {
    // console.log("221",id.value);
    const cat_id=id.value
    this.catId=cat_id
    this.selectedNode = null;
    this.nodeOptions = [];

    
    this.getDropdownList(this.catId,0)
  }
  filterGensets(): GensetCard[] {
    const result: GensetCard[] = [];
  // console.log("this.gensetList",this.gensetList);
  
    this.gensetList.forEach((genset: any) => {
      // If genset.fuel is not an array (legacy or flat format)
    if(genset.isactive){

      if (!genset.fuel || !Array.isArray(genset.fuel)) {
        if (this.selectedFuels.length === 0 || this.selectedFuels.includes(genset.fuel)) {
          result.push(genset);
        }
        return;
      }
  
      genset.fuel.forEach((fuelItem: any) => {
        // ✅ Skip if selectedFuels is not empty AND this fuel is not selected
        if (this.selectedFuels.length > 0 && !this.selectedFuels.includes(fuelItem.name)) {
          return;
        }
  
        fuelItem.ranges.forEach((range: any) => {
          const kvaList = (range.nodes || [])
            .filter((node: any) => node.isactive)
            .sort((a: any, b: any) => Number(a.position) - Number(b.position))
            .map((node: any) => ({
              id: node.id,
              value: node.value
            }));
  
          // ✅ Filter further if selectedNode is set
          if (this.selectedNode && !kvaList.some((kva: any) => kva.id === this.selectedNode)) {
            return;
          }
  
          result.push({
            category: genset.category,
            title: ` ${range.lowRange}-${range.highRange} kVA`,
            image: genset.categoryimage,
            fuel: fuelItem.name,
            kvaList: kvaList,
          });
        });
      });

    }
    });
  
    return result;

  }
  
  
  
  goToProductDetails(nodeId:any){
    this.router.navigate(['/home/product-Details'], {
      queryParams: { id: nodeId }
    });
    
  }
  
}