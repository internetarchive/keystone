import{i as e,_ as t,e as o,s as l,y as c,a as i}from"./chunk-query-assigned-elements.js";import{t as n,h as r}from"./chunk-helpers.js";import{E as a}from"./chunk-index.js";let s=class extends l{constructor(){super(...arguments),this.collectionsInCart={}}get totalCollectionSizeSelected(){return Object.values(this.collectionsInCart).reduce(((e,t)=>e+Number(t.collectionSize)),0)}handleRemoveCollectionFromCart(e){this.emitEvent("collection-removed-from-cart",{collectionName:e})}emitEvent(e,t={}){this.dispatchEvent(a.createEvent(e,t?{detail:t}:{}))}render(){return c`
      <div class="cart-container">
        <div class="collections-cart">
          <h3>Collections Selected</h3>
          <ul>
            ${Object.entries(this.collectionsInCart).map((([e,t])=>c`
                <li>
                  <a
                    class="collectionName"
                    href="https://archive-it.org/collections/${t.collectionId}"
                    target="_blank"
                    >${e}</a
                  >, Organization: ${t.organizationName}, Archived Since:
                  ${n(t.createdDt)},
                  Collection Size: ${r(Number(t.collectionSize))}
                  <button
                    @click=${()=>this.handleRemoveCollectionFromCart(e)}
                  >
                    remove
                  </button>
                </li>
              `))}
          </ul>
          <h4>
            Total Collection Size Selected:
            <span class="totalSizeSelected"
              >${r(this.totalCollectionSizeSelected)}</span
            >
          </h4>
        </div>
      </div>
    `}};s.styles=e`
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
    li {
      margin: 0.6em 0;
      line-height: 1.25;
    }
    .collectionName {
      font-weight: bold;
    }
    a {
      color: #c9540a;
    }
  `,t([o({type:Object})],s.prototype,"collectionsInCart",void 0),s=t([i("collection-surveyor-cart")],s);export{s as CollectionSurveyorCart};
//# sourceMappingURL=collection-surveyor-cart.js.map
