
<template>
    <div class="col-md-12">
        <h1>Create</h1>
        <div class="bs-stepper">
            <div class="bs-stepper-header" role="tablist">
                <div class="step" data-target="#productinformation-part">
                    <button type="button" class="step-trigger" role="tab" aria-controls="productinformation-part" id="productinformation-part-trigger">
                    <span class="bs-stepper-circle">1</span>
                    <span class="bs-stepper-label">Product</span>
                    </button>
                </div>
                <div class="line"></div>
                <div class="step" data-target="#image-part">
                    <button type="button" class="step-trigger" role="tab" aria-controls="image-part" id="image-part-trigger">
                        <span class="bs-stepper-circle">2</span>
                        <span class="bs-stepper-label">Images</span>
                    </button>
                </div>
                <div class="line"></div>
                <div class="step" data-target="#datepicker-part">
                    <button type="button" class="step-trigger" role="tab" aria-controls="datepicker-part" id="datepicker-part-trigger">
                    <span class="bs-stepper-circle">3</span>
                    <span class="bs-stepper-label">DatePicker</span>
                    </button>
                </div>
            </div>
    
            <div class="bs-stepper-content">
                <!-- your steps content here -->
                <div id="productinformation-part" class="content" role="tabpanel" aria-labelledby="productinformation-part-trigger">
                    <div class="form-group">
                        <input type="text" class="form-control input-sm" placeholder="Input Product Name" v-model="forms.name">
                    </div>
                
                    <div class="form-group">
                        <select class="form-control" v-model="forms.category"  >
                            <option v-for="categ in categorylist" id="categ">{{categ}}</option>
                        </select>
                    </div>
                
                    <div class="form-group">
                        <textarea class="form-control" rows="3" v-model="forms.description">
                        </textarea>
                    </div>
                    <button class="btn btn-primary" @click="click_add(1)">Next</button>
                </div>
                <div id="image-part" class="content" role="tabpanel" aria-labelledby="image-part-trigger">
                    <div class="form-group">
                        <label for="exampleInputFile">File input</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input id="upload_img" type="file" v-on:change="onFileChange" class="custom-file-input"  accept="image/jpeg, image/png" multiple>
                                <label class="custom-file-label" for="exampleInputFile">Choose file</label>
                            </div>
                           
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="stepper.previous()">Previous</button>
                    <button class="btn btn-primary" @click="click_add(2)">Next</button>
                    <!-- <button type="submit" class="btn btn-primary">Submit</button> -->
                </div>
                <div id="datepicker-part" class="content" role="tabpanel" aria-labelledby="datepicker-part-trigger">
                    <div class="form-group">
                        <label>Date:</label>
                        <input v-model="forms.dt" type="date" class="form-control datetimepicker-input" data-target="#reservationdate"/>
                    </div>
                    <button class="btn btn-primary" onclick="stepper.previous()">Previous</button>
                    <button @click="click_add(3)" class="btn btn-primary">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:['categories'],
        data() {
            return {
                formdatas: new FormData,
                attachment:[],
                categorylist:this.categories,
                forms:{
                    name: null,
                    category: null,
                    description: null,
                    dt:null,
                    valid: null,

                },
                
                
            }
        },
        mounted(){     

        },
        methods: {
            onFileChange(e){
                let selectedFiles=e.target.files;
                this.attachment = [];
                if(!selectedFiles.length){
                    return false;
                }
                for(let i=0;i<selectedFiles.length;i++){
                    this.attachment.push(selectedFiles[i]);
                }
                $('#upload_img').val('');
                // console.log(this.attachment);
            },
            click_add(id){
               
                const frms = this.forms;
                frms.valid = id;
                if(id===2)
                { 
                    if(this.attachment.length)
                    {
                        const frmdt = this.formdatas
                        frmdt.delete("img[]");
                        for(let i=0; i<this.attachment.length;i++){
                            frmdt.append('img[]',this.attachment[i]);
                        }
                        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                        frmdt.append('valid', id);
                        
                        axios.post('/api/product_validation', frmdt,config)
                        .then(function (response){
                            if (response.status === 200) {
                            
                                if (response.data.status == 'success') {
                                    stepper.next()
                                }
                                else
                                {
                                    // console.log(response.data.message);
                                    toastr.error(response.data.message)
                                }
                            }
                        })
                        .catch(function (error){
                            toastr.error(error)
                            console.log(error)
                        });
                    }{ toastr.error('Please attach some image.')}
                }
                else{
                    axios.post('/api/product_validation',this.forms)
                    .then(function (response){
                        if (response.status === 200) {
                            if (response.data.status == 'success') {
                                stepper.next()
                            }
                            else if (response.data.status == 'save') {
                                window.location = "/products/list"
                              
                            }
                            else
                            {
                                console.log(response.data)
                                toastr.error(response.data.message)
                            }
                        }
                    })
                    .catch(function (error){
                        toastr.error(error)
                        // console.log(error)
                    });
                }
                
            },
        }
        
    }
</script>
