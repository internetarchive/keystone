import{i as e,_ as t,e as o,s as l,y as c,a as n}from"./chunk-lit-element.js";import{a as r}from"./chunk-helpers2.js";let i=class extends l{constructor(){super(...arguments),this.collectionsInCart={}}get totalCollectionSizeSelected(){return Object.values(this.collectionsInCart).reduce(((e,t)=>e+Number(t.collectionSize)),0)}handleRemoveCollectionFromCart(e){this.dispatchEvent(new CustomEvent("collection-removed-from-cart",{bubbles:!0,composed:!0,detail:{collectionName:e}}))}render(){return c`
      <div class="cart-container">
        <div class="collections-cart ">
          <h3>Collections Selected:</h3>
          <ul>
            ${Object.entries(this.collectionsInCart).map((([e,t])=>c`
                <li>
                  ${e}, Collection ID: ${t.collectionId},
                  Collection Size: ${r(Number(t.collectionSize))}
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
              >${r(this.totalCollectionSizeSelected)}</span
            >
          </h3>
        </div>
      </div>
    `}};i.styles=e`
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
  `,t([o({type:Object})],i.prototype,"collectionsInCart",void 0),i=t([n("collection-surveyor-cart")],i);export{i as CollectionSurveyorCart};
//# sourceMappingURL=collection-surveyor-cart.js.map
