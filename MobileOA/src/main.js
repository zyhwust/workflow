import Vue from 'vue'
import App from './App'
import Router from 'vue-router'

import mo_comments from './components/mo_comments.vue'
import mo_work from './components/mo_work.vue'
import mo_session from './components/mo_session.vue'
import mo_contact from './components/mo_contact.vue'
import mo_org from './components/mo_org.vue'
import mo_rela from './components/mo_rela.vue'
import mo_dep from './components/mo_dep.vue'
import mo_chartContent from './components/mo_chartContent.vue'
import mo_chartContent1 from './components/mo_chartContent1.vue'
import mo_chartMessage from './components/mo_chartMessage.vue'
import mo_msg from './components/mo_msg.vue'
import mo_basicServiceWin from './components/mo_basicServiceWin.vue'
import mo_login from './components/mo_login.vue'
import mo_main from './components/mo_main.vue'
import mo_workFlow from './components/mo_workFlow.vue'
import mo_notify from './components/mo_notify'
import mo_task from './components/mo_task.vue'
import mo_taskSearch from './components/mo_taskSearch.vue'
import mo_conference from './components/mo_conference.vue'
import mc_main from './components/mc_main.vue'

//import "./assets/css/font-awesome.css"


Vue.use( Router );
let router = new Router();

router.map({
	'login': {
		component: mo_login
	},
	'main' : {
		component: mo_main,
		subRoutes:{
     		'':{
     			component:mo_notify,
     		},
     		'notify/:type':{
				component:mo_notify,
     		},
			'workFlow/:type':{
				component:mo_workFlow,
			},
			'task/:type':{
				component:mo_task,
			},
			'search':{
				name:'search',
				component:mo_taskSearch,
			},
			'conference/:type':{
				component:mo_conference,
			}
			// 'work':{
			// 	component: mo_work,
			// 	subRoutes:{
			// 		'/':{
			// 			component:{
			// 				template: '<p></p>'
			// 			},
			// 		},
			// 		'notify':{
			// 			component:mo_notify,
			// 		},
			// 		'workFlow':{
			// 			component:mo_workFlow,
			// 		},
			// 		'task':{
			// 			component:mo_task,
			// 		},
			// 		'conference':{
			// 			component:mo_conference,
			// 		}

			// 	}
			// },
			// 'msg':{
			// 	component:mo_msg,
			// 	subRoutes: {
			// 		'/' : {
			// 			component:{
			// 				template: '<p></p>'
			// 			}
			// 		},
			// 		'/chartContent/:name/:id':{
			// 				component:mo_chartContent
			// 		},
			// 		'/chartContent1/:name/:id':{
			// 				component:mo_chartContent1
			// 		},
			// 		'/basicService/:name':{
			// 				component:mo_basicServiceWin
			// 		}
			// 	}
			// }
		}
	},
  'chat' : {
    component: mc_main,
    subRoutes:{
      '':{
        component:mo_msg,
      },
      'contact': {
        component: mo_contact,
        subRoutes: {
          '/': {
            component: mo_org,
          },
          'org': {
            name: 'org',
            component: mo_org,
          },
          'rela': {
            name: 'rela',
            component: mo_rela,
          },
          'dep/:depId/:depName/:typeId': {
            name: 'dep',
            component: mo_dep,
          }
        }
      },
      'msg':{
        component:mo_msg,
        subRoutes: {
          '/' : {
            component:{
              template: '<p></p>'
            }
          },
          '/chartContent/:name/:id':{
            component:mo_chartContent
          },
          '/chartContent1/:name/:id':{
            component:mo_chartContent1
          },
          '/basicService/:name':{
            component:mo_basicServiceWin
          }
        }
      }
    }
  },

});
router.redirect({
	'/': '/login',
})
router.start(App, '#page')

