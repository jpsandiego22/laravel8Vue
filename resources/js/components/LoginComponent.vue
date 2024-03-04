<template>
    <div class="login-box">
        <div class="login-logo">
            <a href="/"><b>USER</b> Management</a>
        </div>
        <div class="card">
            <div class="card-body login-card-body">
                <p class="login-box-msg">Sign in to start your session</p>
                <div id="msg"></div>
                <form action="" method="post">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Username" v-model="form.username">
                        <div class="input-group-append">
                            <div class="input-group-text">
                            <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" placeholder="Password" v-model="form.password">
                        <div class="input-group-append">
                            <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-8">
                            <div class="icheck-primary">
                            <input type="checkbox" id="remember" v-model="form.remember">
                            <label for="remember">
                                Remember Me
                            </label>
                            </div>
                        </div>
                        <div class="col-4">
                            <button type="button" class="btn btn-primary btn-block" @click="submit">Sign In</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    username: null,
                    password: null,
                    remember: 0,
                },
            }
            
        },
        mounted(){},
        methods:{
            submit(){
                const frms = this.form;
                axios.post('http://127.0.0.1:8000/login',this.form)
                .then(function(response){
                    console.log(response.data)
                    if (response.status === 200) {
                        
                        frms.password = null
                        if (response.data.message == 'success') {
                            window.location ='/'
                        } else{
                            toastr.error(response.data.message);
                            $("#msg").html('<div class="alert alert-danger alert-dismissible">'+
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                            '<b><i class="icon fas fa-ban"></i></b>'+ response.data.message +'</center></div>')
                            // toast('danger',response.data.message)
                            // frms.username = null
                        }
                    }
                    else
                    {
                        frms.password = null
                        toastr.error('Something went wrong to the system.');
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
            }
        }
    }
</script>