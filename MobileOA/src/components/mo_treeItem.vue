<template>
  <!--<li>{{itemid}}{{id}}</li>-->
  <ul v-if="id==itemid&&model.length>0" v-on:click = "seb(e)">
    <li v-for="(index,model) in model" v-on:click="checkSub(model.id,index)" v-link="{path: '/chat/contact/dep/'+model.id+'/'+model.name+'/'+typeid}">
      <div class="item-wrapper">
        <div class="div-sub-icon"> </div>
        <span>{{model.name}}</span>
        <item v-bind:model="Model" v-bind:id="Id" v-bind:itemid="model.id" v-bind:typeid="typeid"></item>

      </div>

    </li>
  </ul>

</template>
<script>
  export default{
    name:"item",
    props:['model','id','itemid','typeid'],
    data: function () {
      return {
        Id:0,
        Model:[]
      }
    },
    ready: function () {
//      alert(this.model);

    },
    methods:{
      seb (e){
        e = e || window.event;
        e.stopPropagation();
      },
      checkSub(id,index){
        if(this.Id == id){
          this.Id = 0;
        }else{
          this.Id = id;
          this.Model = this.model[index].children;
        }
      }
    }

  }
</script>
<style>

</style>
