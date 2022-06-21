/* eslint-disable no-undef */
import Vue from "vue";
import VueRouter from "vue-router";
import { AnalyticRoutes } from "./analyticRoutes";
import { vaultDetailsRoute } from "./vaultDetailRoutes";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Homepage",
    component: () => import("../views/Homepage"),
    meta: {
      title: "Gamma — Provide Active Liquidity to Uniswap v3",
      metaTags: [
        {
          name: 'title',
          content: "Gamma — Provide Active Liquidity to Uniswap v3"
        },
        {
          name: 'description',
          content: "Active Liquidity Management and Market Making on Uniswap v3."
        },
        {
          property: 'og:description',
          content: 'Active Liquidity Management and Market Making on Uniswap v3.'
        }
      ]
    }
  },
  {
    path: "/strategies",
    name: "Strategy",
    component: () => import("../views/Strategy")
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/testinit")
  },
  {
    path: "/address",
    name: "Address",
    component: () => import("../views/Address")
  },
  {
    path: "/lorem1",
    name: "Lorem1",
    component: () => import("../views/Lorem1")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/LoremTableDemo")
  },
  {
    path: "/dashboard-demo",
    name: "DashboardDemo",
    component: () => import("../views/LoremTableDemo")
  },
  {
    path: "/staking",
    name: "Visr",
    component: () => import("../views/StakedStats"),
    meta: {
      title: "Gamma — Earn Fees From Gamma's TVL",
      metaTags: [
        {
          name: 'title',
          content: "Gamma — Earn Fees From Gamma's TVL."
        },
        {
          name: 'description',
          content: "Stake GAMMA and receive fee distributions daily."
        },
        {
          property: 'og:description',
          content: 'Stake GAMMA and receive fee distributions daily.'
        }
      ]
    }
  },
  {
    path: "/ens",
    name: "Ens",
    component: () => import("../views/Ens")
  },

  {
    path: "/active-liquidity",
    name: "ActiveLiquidity",
    component: () => import("../views/ActiveLiquidity")
  },
  {
    path: "/vault-detail/:pair",
    name: "VaultDetail",
    component: () => import("../views/VaultDetail")
  },
  // {
  //   path: "/backtest",
  //   name: "Backtest",
  //   component: () => import("../views/Backtest")
  // },
  {
    path: "/liquidity-mining",
    name: "Liquidity Mining",
    component: () => import("../views/LiquidityMining")
  },
  {
    path: "/migrate",
    name: "Migrate",
    component: () => import("../views/Migrate")
  },
  {
    path: "/protocol-stats",
    name: "Protocol Stats",
    component: () => import("../views/ProtocolStats")
  },
  {
    path: "/staked-stats",
    name: "Staked Stats",
    component: () => import("../views/StakedStats")
  },
  {
    path: "*",
    redirect: "/not-found.html"
  },
  ...AnalyticRoutes
];

const router = new VueRouter({
  mode: "history",
  routes
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});



export default router;
