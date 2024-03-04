
<template>
    <div>
        <h1>Lists</h1> <div class="d-flex align-items-center ml-4 pull-right"><a :href="this.datasource.link_create" class="btn btn-success bt-sm pull-right">Create</a></div>
        <div class="d-flex justify-content-between align-content-center mb-2">
            <div class="d-flex">
                <div>
                    <div class="d-flex align-items-center ml-4">
                        <label for="paginate" class="text-nowrap mr-2 mb-0">Per Page</label>
                        <select v-model="paginate" class="form-control form-control-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <div>
                   
                    <div class="d-flex align-items-center ml-4">
                        <label for="paginate" class="text-nowrap mr-2 mb-0">Filter By Category</label>
                        <select v-model="filter" class="form-control form-control-sm">
                            <option value="">All Class</option>
                            <option v-for="index in this.datasource.category">{{index}}</option>
                        </select>
                    </div>
                </div>
            </div>
           
            <div class="col-md-4">
                <input v-model="search" type="search" class="form-control" placeholder="Search by Product & Description"
                />
            </div>
        </div>
        <div class="clearfix"><br></div>
        <div class="card-body table-responsive p-1">
            <table class="table table-hover table-bordered table-striped border-top">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Date Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(itemx, index) in products.data" :key="itemx.id">
                        <td>{{ index+1 }}</td>
                        <td>{{ itemx.name}}</td>
                        <td>{{ itemx.category}}</td>
                        <td>{{ itemx.description}}</td>
                        <td>{{ itemx.date_created}}</td>
                        <td>
                            <a :href="'/products/'+ itemx.id +'/edit'" class="btn btn-info btn-sm m-1">Edit</a>
                            <button @click="item_remove(itemx.id)" class="btn btn-danger btn-sm m-1">Remove</button>
                        </td>
                    </tr>
                </tbody>
                
            </table>
        </div>
        <div class="row mt-4">
            <div class="col-sm-6 "></div>
            <div class="col-sm-6 ">
                <pagination :data="products" @pagination-change-page="getProducts"></pagination>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<script>
    export default {
        name:'getProducts',
        props: ['datasource'],
        data() {
            return {
                products: {},
                paginate : 10,
                search:'',
                filter:'',
                data:{iid:0}
            }
        },
        watch:{
            paginate: function(value){
                this.getProducts();
            },
            search:function(value){
                this.getProducts();
            },
            filter:function(value){
                this.getProducts();
            }
        },
        created(){
            this.getProducts()
        },
        mounted(){
                
            },
        methods: {
            item_remove(id){
                this.data.iid = id;
                const list =  this.getProducts
                if(confirm("Do you really want to delete?")){
                    axios.post('/api/remove_product',this.data)
                    .then(function (response){
                        console.log(response.data)
                        if (response.status === 200) {
                            if (response.data.status == 'success') {
                                toastr.error(response.data.message)
                                list()
                            }
                            else
                            {
                                toastr.error(response.data.message)
                            }
                        }
                    })
                    .catch(function (error){
                        toastr.error(error)
                        console.log(error)
                    });
                }
            },
            
            getProducts(page = 1){
                const pgnt = this.paginate;

                axios.get('/api/get_data?page='+ page + '&paginate=' + pgnt
                + '&filter='+ this.search
                + '&filterby='+ this.filter
                ).then(response => {
                    this.products=response.data
                    // this.category=response.data.category
                    // console.log(this.product)
                })
            },
            
           
            
        }
    }

</script>
