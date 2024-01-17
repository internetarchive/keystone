import{i as e,_ as t,e as o,s as l,y as c,a as n}from"./chunk-query-assigned-elements.js";function i(e,t=3){for(const o of["","Ki","Mi","Gi","Ti","Pi"]){if(e<1024){const[l,c]=e.toString().split(".");return`${l}${c?`.${c.slice(0,t)}`:""} ${o}B`}e/=1024}return""}let r=class extends l{constructor(){super(...arguments),this.collectionsInCart={}}get totalCollectionSizeSelected(){return Object.values(this.collectionsInCart).reduce(((e,t)=>e+Number(t.collectionSize)),0)}handleRemoveCollectionFromCart(e){this.dispatchEvent(new CustomEvent("collection-removed-from-cart",{bubbles:!0,composed:!0,detail:{collectionName:e}}))}render(){return c`
      <div class="cart-container">
        <div class="collections-cart ">
          <h3>Collections Selected:</h3>
          <ul>
            ${Object.entries(this.collectionsInCart).map((([e,t])=>c`
                <li>
                  ${e}, Collection ID: ${t.collectionId},
                  Collection Size: ${i(Number(t.collectionSize))}
                  <button
                    @click=${()=>this.handleRemoveCollectionFromCart(e)}
                  >
                    remove
                  </button>
                </li>
              `))}
          </ul>
          <h3>
            Total Collection Size Selected:
            <span class="totalSizeSelected"
              >${i(this.totalCollectionSizeSelected)}</span
            >
          </h3>
        </div>
      </div>
    `}};r.styles=e`
    .cart-container {
      padding: 20px 50px;
    }
    .collections-cart {
      padding: 20px;
      border-radius: 6px;
      background-color: rgb(255, 255, 255);
      box-shadow: rgb(136, 136, 136) 1px 1px 6px;
    }
    .totalSizeSelected {
      font-weight: normal;
    }
    button {
      background: none;
      border: none;
      cursor: pointer;
      color: red;
      text-decoration: underline;
    }
  `,t([o({type:Object})],r.prototype,"collectionsInCart",void 0),r=t([n("collection-surveyor-cart")],r);export{r as C,i as h};
//# sourceMappingURL=chunk-collection-surveyor-cart.js.map
