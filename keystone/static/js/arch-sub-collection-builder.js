import{i as e,_ as n,e as t,s as o,y as d,a}from"./chunk-lit-element.js";import{t as s}from"./chunk-state.js";import{g as m,B as i,o as l,i as r}from"./chunk-styles.js";import{A as c}from"./chunk-ArchAPI.js";import{b as p,H as v,S as f,f as x,d as u,a as g}from"./chunk-helpers.js";import{ArchGlobalModal as h}from"./arch-global-modal.js";import{e as b}from"./chunk-event-options.js";import"./chunk-arch-modal.js";import{i as y}from"./chunk-helpers2.js";import{c as w}from"./chunk-domLib.js";import"./chunk-scale-large.js";import"./chunk-sizedMixin.js";var k,j=[m,i,e`
    div.alert {
      display: flex;
      padding: 0;
    }

    p {
      font-size: 1rem;
      line-height: 1.6rem;
      flex-grow: 1;
      margin: 0;
      padding: 1.2rem 0 1.2rem 1.2rem;
    }

    button {
      align-self: flex-start;
      padding: 1.2rem;
      font-size: 1.2rem;
    }

    button:hover {
      font-weight: bold;
    }
  `];!function(e){e.Danger="danger",e.Dark="dark",e.Info="info",e.Light="light",e.Primary="primary",e.Secondary="secondary",e.Success="success",e.Warning="warning"}(k||(k={}));let C=class extends o{constructor(){super(...arguments),this.alertClass=k.Primary,this.hidden=!1,this.message=""}render(){return d`
      <div
        class="alert alert-${this.alertClass}"
        style="display: ${this.hidden?"none":"flex"}"
        role="alert"
      >
        <p>${l(this.message)}</p>
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
          style="background-color: transparent;"
          @click=${this.hide}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `}hide(){this.setAttribute("hidden","")}show(){this.removeAttribute("hidden")}};C.styles=j,n([t({type:String})],C.prototype,"alertClass",void 0),n([t({type:Boolean})],C.prototype,"hidden",void 0),n([t({type:String})],C.prototype,"message",void 0),C=n([a("arch-alert")],C);var S,P=[m,e`
    ul {
      padding-left: 2rem;
    }

    dt {
      margin-left: 1rem;
      display: inline-block;
      font-weight: normal;
    }

    dt:first-of-type {
      margin-top: 1rem;
    }

    dd:after {
      content: "";
      padding: 0;
    }

    em {
      display: block;
      margin: 0.3rem 0;
      margin-left: 1rem;
    }

    span.new-name,
    li.input-collection,
    span.filter-value {
      font-weight: bold;
    }
  `];let z=S=class extends o{getCollectionName(e){for(const n of this.collections)if(n.id===e)return n.name;return""}render(){var e;const{data:n}=this,t=void 0===n?[]:S.dataKeyTitlePairs.filter((([e])=>void 0!==n[e])).map((([e,t])=>[t,(Array.isArray(n[e])?n[e]:[n[e]]).map((n=>`<span class="filter-value">${S.dataKeyValueFormatterMap[e](n)}</span>`)).join(" or ")]));return d`
      <arch-modal title="Review Your Custom Collection" modalSize="l">
        <div slot="content">
          ${void 0===n?d``:d`
            <p>
      You are about to create a custom collection named &quot;<span class="new-name">${n.name}</span>&quot; from the following
              source collections:
              <ul>
                ${Array.from(null!==(e=n.sources)&&void 0!==e?e:[]).map((e=>d`<li class="input-collection">
                      ${this.getCollectionName(parseInt(e))}
                    </li>`))}
              </ul>
            </p>
            <p>
              This custom collection will be
              ${0===t.length?d`an unfiltered combination of the source collections.`:d`
                      the result of filtering the source collections by:
                      <dl>
                        ${t.map((([e,n],t)=>d` ${0===t?d``:d`<em>and</em>`}
                            <dt>${e}</dt>
                            <dd>${l(n)}</dd>
                            <br />`))}
                      </dl>
                    `}
            </p>
      `}
        </div>
        <button slot="trigger" class="primary" @click=${this.clickHandler}>
          Create Custom Collection
        </button>
      </arch-modal>
    `}clickHandler(e){this.validateForm()||e.stopPropagation()}};z.styles=P,z.shadowRootOptions={...o.shadowRootOptions,delegatesFocus:!0},z.dataKeyTitlePairs=[["surtPrefixesOR","SURT Prefix(es)"],["timestampFrom","Crawl Date (start)"],["timestampTo","Crawl Date (end)"],["statusPrefixesOR","HTTP Status"],["mimesOR","MIME Type"]],z.dataKeyValueFormatterMap={mimesOR:p,name:p,sources:p,statusPrefixesOR:p,surtPrefixesOR:p,timestampFrom:e=>`on or after ${y(e)}`,timestampTo:e=>`on or before ${y(e)}`},n([t()],z.prototype,"validateForm",void 0),n([t()],z.prototype,"collections",void 0),n([t()],z.prototype,"data",void 0),n([b({capture:!0})],z.prototype,"clickHandler",null),z=S=n([a("arch-sub-collection-builder-submit-button")],z);var M,E=[m,e`
    label {
      margin-top: 1rem;
    }

    label:first-of-type {
      margin-top: 0;
    }

    em {
      line-height: 1.2em;
    }

    arch-sub-collection-builder-submit-button {
      display: block;
      margin-top: 1rem;
    }

    select#sources,
    input#name,
    input#surts {
      width: 100%;
    }

    select#sources {
      resize: vertical;
    }

    input#status,
    input#mime {
      width: 50%;
    }
  `],D={application:["1d-interleaved-parityfec","3gpdash-qoe-report+xml","3gppHal+json","3gppHalForms+json","3gpp-ims+xml","A2L","ace+cbor","ace+json","activemessage","activity+json","aif+cbor","aif+json","alto-cdni+json","alto-cdnifilter+json","alto-costmap+json","alto-costmapfilter+json","alto-directory+json","alto-endpointprop+json","alto-endpointpropparams+json","alto-endpointcost+json","alto-endpointcostparams+json","alto-error+json","alto-networkmapfilter+json","alto-networkmap+json","alto-propmap+json","alto-propmapparams+json","alto-updatestreamcontrol+json","alto-updatestreamparams+json","AML","andrew-inset","applefile","at+jwt","ATF","ATFX","atom+xml","atomcat+xml","atomdeleted+xml","atomicmail","atomsvc+xml","atsc-dwd+xml","atsc-dynamic-event-message","atsc-held+xml","atsc-rdt+json","atsc-rsat+xml","ATXML","auth-policy+xml","automationml-aml+xml","automationml-amlx+zip","bacnet-xdd+zip","batch-SMTP","beep+xml","calendar+json","calendar+xml","call-completion","CALS-1840","captive+json","cbor","cbor-seq","cccex","ccmp+xml","ccxml+xml","cda+xml","CDFX+XML","cdmi-capability","cdmi-container","cdmi-domain","cdmi-object","cdmi-queue","cdni","CEA","cea-2018+xml","cellml+xml","cfw","city+json","clr","clue_info+xml","clue+xml","cms","cnrp+xml","coap-group+json","coap-payload","commonground","concise-problem-details+cbor","conference-info+xml","cpl+xml","cose","cose-key","cose-key-set","cose-x509","csrattrs","csta+xml","CSTAdata+xml","csvm+json","cwl","cwl+json","cwt","cybercash","dash+xml","dash-patch+xml","dashdelta","davmount+xml","dca-rft","DCD","dec-dx","dialog-info+xml","dicom","dicom+json","dicom+xml","DII","DIT","dns","dns+json","dns-message","dots+cbor","dpop+jwt","dskpp+xml","dssc+der","dssc+xml","dvcs","ecmascript","EDI-consent","EDIFACT","EDI-X12","efi","elm+json","elm+xml","EmergencyCallData.cap+xml","EmergencyCallData.Comment+xml","EmergencyCallData.Control+xml","EmergencyCallData.DeviceInfo+xml","EmergencyCallData.eCall.MSD","EmergencyCallData.LegacyESN+json","EmergencyCallData.ProviderInfo+xml","EmergencyCallData.ServiceInfo+xml","EmergencyCallData.SubscriberInfo+xml","EmergencyCallData.VEDS+xml","emma+xml","emotionml+xml","encaprtp","epp+xml","epub+zip","eshop","example","exi","expect-ct-report+json","express","fastinfoset","fastsoap","fdf","fdt+xml","fhir+json","fhir+xml","fits","flexfec","font-sfnt","font-tdpfr","font-woff","framework-attributes+xml","geo+json","geo+json-seq","geopackage+sqlite3","geoxacml+xml","gltf-buffer","gml+xml","gzip","H224","held+xml","hl7v2+xml","http","hyperstudio","ibe-key-request+xml","ibe-pkg-reply+xml","ibe-pp-data","iges","im-iscomposing+xml","index","index.cmd","index.obj","index.response","index.vnd","inkml+xml","IOTP","ipfix","ipp","ISUP","its+xml","java-archive","javascript","jf2feed+json","jose","jose+json","jrd+json","jscalendar+json","json","json-patch+json","json-seq","jwk+json","jwk-set+json","jwt","kpml-request+xml","kpml-response+xml","ld+json","lgr+xml","link-format","linkset","linkset+json","load-control+xml","logout+jwt","lost+xml","lostsync+xml","lpf+zip","LXF","mac-binhex40","macwriteii","mads+xml","manifest+json","marc","marcxml+xml","mathematica","mathml+xml","mathml-content+xml","mathml-presentation+xml","mbms-associated-procedure-description+xml","mbms-deregister+xml","mbms-envelope+xml","mbms-msk-response+xml","mbms-msk+xml","mbms-protection-description+xml","mbms-reception-report+xml","mbms-register-response+xml","mbms-register+xml","mbms-schedule+xml","mbms-user-service-description+xml","mbox","media_control+xml","media-policy-dataset+xml","mediaservercontrol+xml","merge-patch+json","metalink4+xml","mets+xml","MF4","mikey","mipc","missing-blocks+cbor-seq","mmt-aei+xml","mmt-usd+xml","mods+xml","moss-keys","moss-signature","mosskey-data","mosskey-request","mp21","mp4","mpeg4-generic","mpeg4-iod","mpeg4-iod-xmt","mrb-consumer+xml","mrb-publish+xml","msc-ivr+xml","msc-mixer+xml","msword","mud+json","multipart-core","mxf","n-quads","n-triples","nasdata","news-checkgroups","news-groupinfo","news-transmission","nlsml+xml","node","nss","oauth-authz-req+jwt","oblivious-dns-message","ocsp-request","ocsp-response","octet-stream","ODA","odm+xml","ODX","oebps-package+xml","ogg","ohttp-keys","opc-nodeset+xml","oscore","oxps","p21","p21+zip","p2p-overlay+xml","parityfec","passport","patch-ops-error+xml","pdf","PDX","pem-certificate-chain","pgp-encrypted","pgp-keys","pgp-signature","pidf-diff+xml","pidf+xml","pkcs10","pkcs7-mime","pkcs7-signature","pkcs8","pkcs8-encrypted","pkcs12","pkix-attr-cert","pkix-cert","pkix-crl","pkix-pkipath","pkixcmp","pls+xml","poc-settings+xml","postscript","ppsp-tracker+json","problem+json","problem+xml","provenance+xml","prs.alvestrand.titrax-sheet","prs.cww","prs.cyn","prs.hpub+zip","prs.implied-document+xml","prs.implied-executable","prs.implied-structure","prs.nprend","prs.plucker","prs.rdf-xml-crypt","prs.xsf+xml","pskc+xml","pvd+json","rdf+xml","route-apd+xml","route-s-tsid+xml","route-usd+xml","QSIG","raptorfec","rdap+json","reginfo+xml","relax-ng-compact-syntax","remote-printing","reputon+json","resource-lists-diff+xml","resource-lists+xml","rfc+xml","riscos","rlmi+xml","rls-services+xml","rpki-checklist","rpki-ghostbusters","rpki-manifest","rpki-publication","rpki-roa","rpki-updown","rtf","rtploopback","rtx","samlassertion+xml","samlmetadata+xml","sarif-external-properties+json","sarif+json","sbe","sbml+xml","scaip+xml","scim+json","scvp-cv-request","scvp-cv-response","scvp-vp-request","scvp-vp-response","sdp","secevent+jwt","senml-etch+cbor","senml-etch+json","senml-exi","senml+cbor","senml+json","senml+xml","sensml-exi","sensml+cbor","sensml+json","sensml+xml","sep-exi","sep+xml","session-info","set-payment","set-payment-initiation","set-registration","set-registration-initiation","SGML","sgml-open-catalog","shf+xml","sieve","simple-filter+xml","simple-message-summary","simpleSymbolContainer","sipc","slate","smil","smil+xml","smpte336m","soap+fastinfoset","soap+xml","sparql-query","spdx+json","sparql-results+xml","spirits-event+xml","sql","srgs","srgs+xml","sru+xml","ssml+xml","stix+json","swid+cbor","swid+xml","tamp-apex-update","tamp-apex-update-confirm","tamp-community-update","tamp-community-update-confirm","tamp-error","tamp-sequence-adjust","tamp-sequence-adjust-confirm","tamp-status-query","tamp-status-response","tamp-update","tamp-update-confirm","taxii+json","td+json","tei+xml","TETRA_ISI","thraud+xml","timestamp-query","timestamp-reply","timestamped-data","tlsrpt+gzip","tlsrpt+json","tm+json","tnauthlist","token-introspection+jwt","trickle-ice-sdpfrag","trig","ttml+xml","tve-trigger","tzif","tzif-leap","ulpfec","urc-grpsheet+xml","urc-ressheet+xml","urc-targetdesc+xml","urc-uisocketdesc+xml","vcard+json","vcard+xml","vemmi","vnd.1000minds.decision-model+xml","vnd.1ob","vnd.3gpp.5gnas","vnd.3gpp.access-transfer-events+xml","vnd.3gpp.bsf+xml","vnd.3gpp.crs+xml","vnd.3gpp.current-location-discovery+xml","vnd.3gpp.GMOP+xml","vnd.3gpp.gtpc","vnd.3gpp.interworking-data","vnd.3gpp.lpp","vnd.3gpp.mc-signalling-ear","vnd.3gpp.mcdata-affiliation-command+xml","vnd.3gpp.mcdata-info+xml","vnd.3gpp.mcdata-msgstore-ctrl-request+xml","vnd.3gpp.mcdata-payload","vnd.3gpp.mcdata-regroup+xml","vnd.3gpp.mcdata-service-config+xml","vnd.3gpp.mcdata-signalling","vnd.3gpp.mcdata-ue-config+xml","vnd.3gpp.mcdata-user-profile+xml","vnd.3gpp.mcptt-affiliation-command+xml","vnd.3gpp.mcptt-floor-request+xml","vnd.3gpp.mcptt-info+xml","vnd.3gpp.mcptt-location-info+xml","vnd.3gpp.mcptt-mbms-usage-info+xml","vnd.3gpp.mcptt-regroup+xml","vnd.3gpp.mcptt-service-config+xml","vnd.3gpp.mcptt-signed+xml","vnd.3gpp.mcptt-ue-config+xml","vnd.3gpp.mcptt-ue-init-config+xml","vnd.3gpp.mcptt-user-profile+xml","vnd.3gpp.mcvideo-affiliation-command+xml","vnd.3gpp.mcvideo-affiliation-info+xml","vnd.3gpp.mcvideo-info+xml","vnd.3gpp.mcvideo-location-info+xml","vnd.3gpp.mcvideo-mbms-usage-info+xml","vnd.3gpp.mcvideo-regroup+xml","vnd.3gpp.mcvideo-service-config+xml","vnd.3gpp.mcvideo-transmission-request+xml","vnd.3gpp.mcvideo-ue-config+xml","vnd.3gpp.mcvideo-user-profile+xml","vnd.3gpp.mid-call+xml","vnd.3gpp.ngap","vnd.3gpp.pfcp","vnd.3gpp.pic-bw-large","vnd.3gpp.pic-bw-small","vnd.3gpp.pic-bw-var","vnd.3gpp-prose-pc3a+xml","vnd.3gpp-prose-pc3ach+xml","vnd.3gpp-prose-pc3ch+xml","vnd.3gpp-prose-pc8+xml","vnd.3gpp-prose+xml","vnd.3gpp.s1ap","vnd.3gpp.seal-group-doc+xml","vnd.3gpp.seal-info+xml","vnd.3gpp.seal-location-info+xml","vnd.3gpp.seal-mbms-usage-info+xml","vnd.3gpp.seal-network-QoS-management-info+xml","vnd.3gpp.seal-ue-config-info+xml","vnd.3gpp.seal-unicast-info+xml","vnd.3gpp.seal-user-profile-info+xml","vnd.3gpp.sms","vnd.3gpp.sms+xml","vnd.3gpp.srvcc-ext+xml","vnd.3gpp.SRVCC-info+xml","vnd.3gpp.state-and-event-info+xml","vnd.3gpp.ussd+xml","vnd.3gpp.vae-info+xml","vnd.3gpp-v2x-local-service-information","vnd.3gpp2.bcmcsinfo+xml","vnd.3gpp2.sms","vnd.3gpp2.tcap","vnd.3gpp.v2x","vnd.3lightssoftware.imagescal","vnd.3M.Post-it-Notes","vnd.accpac.simply.aso","vnd.accpac.simply.imp","vnd.acm.addressxfer+json","vnd.acucobol","vnd.acucorp","vnd.adobe.flash.movie","vnd.adobe.formscentral.fcdt","vnd.adobe.fxp","vnd.adobe.partial-upload","vnd.adobe.xdp+xml","vnd.aether.imp","vnd.afpc.afplinedata","vnd.afpc.afplinedata-pagedef","vnd.afpc.cmoca-cmresource","vnd.afpc.foca-charset","vnd.afpc.foca-codedfont","vnd.afpc.foca-codepage","vnd.afpc.modca","vnd.afpc.modca-cmtable","vnd.afpc.modca-formdef","vnd.afpc.modca-mediummap","vnd.afpc.modca-objectcontainer","vnd.afpc.modca-overlay","vnd.afpc.modca-pagesegment","vnd.age","vnd.ah-barcode","vnd.ahead.space","vnd.airzip.filesecure.azf","vnd.airzip.filesecure.azs","vnd.amadeus+json","vnd.amazon.mobi8-ebook","vnd.americandynamics.acc","vnd.amiga.ami","vnd.amundsen.maze+xml","vnd.android.ota","vnd.anki","vnd.anser-web-certificate-issue-initiation","vnd.antix.game-component","vnd.apache.arrow.file","vnd.apache.arrow.stream","vnd.apache.thrift.binary","vnd.apache.thrift.compact","vnd.apache.thrift.json","vnd.apexlang","vnd.api+json","vnd.aplextor.warrp+json","vnd.apothekende.reservation+json","vnd.apple.installer+xml","vnd.apple.keynote","vnd.apple.mpegurl","vnd.apple.numbers","vnd.apple.pages","vnd.arastra.swi","vnd.aristanetworks.swi","vnd.artisan+json","vnd.artsquare","vnd.astraea-software.iota","vnd.audiograph","vnd.autopackage","vnd.avalon+json","vnd.avistar+xml","vnd.balsamiq.bmml+xml","vnd.banana-accounting","vnd.bbf.usp.error","vnd.bbf.usp.msg","vnd.bbf.usp.msg+json","vnd.balsamiq.bmpr","vnd.bekitzur-stech+json","vnd.belightsoft.lhzd+zip","vnd.belightsoft.lhzl+zip","vnd.bint.med-content","vnd.biopax.rdf+xml","vnd.blink-idb-value-wrapper","vnd.blueice.multipass","vnd.bluetooth.ep.oob","vnd.bluetooth.le.oob","vnd.bmi","vnd.bpf","vnd.bpf3","vnd.businessobjects","vnd.byu.uapi+json","vnd.cab-jscript","vnd.canon-cpdl","vnd.canon-lips","vnd.capasystems-pg+json","vnd.cendio.thinlinc.clientconf","vnd.century-systems.tcp_stream","vnd.chemdraw+xml","vnd.chess-pgn","vnd.chipnuts.karaoke-mmd","vnd.ciedi","vnd.cinderella","vnd.cirpack.isdn-ext","vnd.citationstyles.style+xml","vnd.claymore","vnd.cloanto.rp9","vnd.clonk.c4group","vnd.cluetrust.cartomobile-config","vnd.cluetrust.cartomobile-config-pkg","vnd.cncf.helm.chart.content.v1.tar+gzip","vnd.cncf.helm.chart.provenance.v1.prov","vnd.cncf.helm.config.v1+json","vnd.coffeescript","vnd.collabio.xodocuments.document","vnd.collabio.xodocuments.document-template","vnd.collabio.xodocuments.presentation","vnd.collabio.xodocuments.presentation-template","vnd.collabio.xodocuments.spreadsheet","vnd.collabio.xodocuments.spreadsheet-template","vnd.collection.doc+json","vnd.collection+json","vnd.collection.next+json","vnd.comicbook-rar","vnd.comicbook+zip","vnd.commerce-battelle","vnd.commonspace","vnd.coreos.ignition+json","vnd.cosmocaller","vnd.contact.cmsg","vnd.crick.clicker","vnd.crick.clicker.keyboard","vnd.crick.clicker.palette","vnd.crick.clicker.template","vnd.crick.clicker.wordbank","vnd.criticaltools.wbs+xml","vnd.cryptii.pipe+json","vnd.crypto-shade-file","vnd.cryptomator.encrypted","vnd.cryptomator.vault","vnd.ctc-posml","vnd.ctct.ws+xml","vnd.cups-pdf","vnd.cups-postscript","vnd.cups-ppd","vnd.cups-raster","vnd.cups-raw","vnd.curl","vnd.cyan.dean.root+xml","vnd.cybank","vnd.cyclonedx+json","vnd.cyclonedx+xml","vnd.d2l.coursepackage1p0+zip","vnd.d3m-dataset","vnd.d3m-problem","vnd.dart","vnd.data-vision.rdz","vnd.datalog","vnd.datapackage+json","vnd.dataresource+json","vnd.dbf","vnd.debian.binary-package","vnd.dece.data","vnd.dece.ttml+xml","vnd.dece.unspecified","vnd.dece.zip","vnd.denovo.fcselayout-link","vnd.desmume.movie","vnd.dir-bi.plate-dl-nosuffix","vnd.dm.delegation+xml","vnd.dna","vnd.document+json","vnd.dolby.mobile.1","vnd.dolby.mobile.2","vnd.doremir.scorecloud-binary-document","vnd.dpgraph","vnd.dreamfactory","vnd.drive+json","vnd.dtg.local","vnd.dtg.local.flash","vnd.dtg.local.html","vnd.dvb.ait","vnd.dvb.dvbisl+xml","vnd.dvb.dvbj","vnd.dvb.esgcontainer","vnd.dvb.ipdcdftnotifaccess","vnd.dvb.ipdcesgaccess","vnd.dvb.ipdcesgaccess2","vnd.dvb.ipdcesgpdd","vnd.dvb.ipdcroaming","vnd.dvb.iptv.alfec-base","vnd.dvb.iptv.alfec-enhancement","vnd.dvb.notif-aggregate-root+xml","vnd.dvb.notif-container+xml","vnd.dvb.notif-generic+xml","vnd.dvb.notif-ia-msglist+xml","vnd.dvb.notif-ia-registration-request+xml","vnd.dvb.notif-ia-registration-response+xml","vnd.dvb.notif-init+xml","vnd.dvb.pfr","vnd.dvb.service","vnd.dxr","vnd.dynageo","vnd.dzr","vnd.easykaraoke.cdgdownload","vnd.ecip.rlp","vnd.ecdis-update","vnd.eclipse.ditto+json","vnd.ecowin.chart","vnd.ecowin.filerequest","vnd.ecowin.fileupdate","vnd.ecowin.series","vnd.ecowin.seriesrequest","vnd.ecowin.seriesupdate","vnd.efi.img","vnd.efi.iso","vnd.eln+zip","vnd.emclient.accessrequest+xml","vnd.enliven","vnd.enphase.envoy","vnd.eprints.data+xml","vnd.epson.esf","vnd.epson.msf","vnd.epson.quickanime","vnd.epson.salt","vnd.epson.ssf","vnd.ericsson.quickcall","vnd.espass-espass+zip","vnd.eszigno3+xml","vnd.etsi.aoc+xml","vnd.etsi.asic-s+zip","vnd.etsi.asic-e+zip","vnd.etsi.cug+xml","vnd.etsi.iptvcommand+xml","vnd.etsi.iptvdiscovery+xml","vnd.etsi.iptvprofile+xml","vnd.etsi.iptvsad-bc+xml","vnd.etsi.iptvsad-cod+xml","vnd.etsi.iptvsad-npvr+xml","vnd.etsi.iptvservice+xml","vnd.etsi.iptvsync+xml","vnd.etsi.iptvueprofile+xml","vnd.etsi.mcid+xml","vnd.etsi.mheg5","vnd.etsi.overload-control-policy-dataset+xml","vnd.etsi.pstn+xml","vnd.etsi.sci+xml","vnd.etsi.simservs+xml","vnd.etsi.timestamp-token","vnd.etsi.tsl+xml","vnd.etsi.tsl.der","vnd.eu.kasparian.car+json","vnd.eudora.data","vnd.evolv.ecig.profile","vnd.evolv.ecig.settings","vnd.evolv.ecig.theme","vnd.exstream-empower+zip","vnd.exstream-package","vnd.ezpix-album","vnd.ezpix-package","vnd.f-secure.mobile","vnd.fastcopy-disk-image","vnd.familysearch.gedcom+zip","vnd.fdsn.mseed","vnd.fdsn.seed","vnd.ffsns","vnd.ficlab.flb+zip","vnd.filmit.zfc","vnd.fints","vnd.firemonkeys.cloudcell","vnd.FloGraphIt","vnd.fluxtime.clip","vnd.font-fontforge-sfd","vnd.framemaker","vnd.freelog.comic","vnd.frogans.fnc","vnd.frogans.ltf","vnd.fsc.weblaunch","vnd.fujifilm.fb.docuworks","vnd.fujifilm.fb.docuworks.binder","vnd.fujifilm.fb.docuworks.container","vnd.fujifilm.fb.jfi+xml","vnd.fujitsu.oasys","vnd.fujitsu.oasys2","vnd.fujitsu.oasys3","vnd.fujitsu.oasysgp","vnd.fujitsu.oasysprs","vnd.fujixerox.ART4","vnd.fujixerox.ART-EX","vnd.fujixerox.ddd","vnd.fujixerox.docuworks","vnd.fujixerox.docuworks.binder","vnd.fujixerox.docuworks.container","vnd.fujixerox.HBPL","vnd.fut-misnet","vnd.futoin+cbor","vnd.futoin+json","vnd.fuzzysheet","vnd.genomatix.tuxedo","vnd.genozip","vnd.gentics.grd+json","vnd.gentoo.catmetadata+xml","vnd.gentoo.ebuild","vnd.gentoo.eclass","vnd.gentoo.gpkg","vnd.gentoo.manifest","vnd.gentoo.xpak","vnd.gentoo.pkgmetadata+xml","vnd.geo+json","vnd.geocube+xml","vnd.geogebra.file","vnd.geogebra.slides","vnd.geogebra.tool","vnd.geometry-explorer","vnd.geonext","vnd.geoplan","vnd.geospace","vnd.gerber","vnd.globalplatform.card-content-mgt","vnd.globalplatform.card-content-mgt-response","vnd.gmx","vnd.gnu.taler.exchange+json","vnd.gnu.taler.merchant+json","vnd.google-earth.kml+xml","vnd.google-earth.kmz","vnd.gov.sk.e-form+xml","vnd.gov.sk.e-form+zip","vnd.gov.sk.xmldatacontainer+xml","vnd.gpxsee.map+xml","vnd.grafeq","vnd.gridmp","vnd.groove-account","vnd.groove-help","vnd.groove-identity-message","vnd.groove-injector","vnd.groove-tool-message","vnd.groove-tool-template","vnd.groove-vcard","vnd.hal+json","vnd.hal+xml","vnd.HandHeld-Entertainment+xml","vnd.hbci","vnd.hc+json","vnd.hcl-bireports","vnd.hdt","vnd.heroku+json","vnd.hhe.lesson-player","vnd.hp-HPGL","vnd.hp-hpid","vnd.hp-hps","vnd.hp-jlyt","vnd.hp-PCL","vnd.hp-PCLXL","vnd.hsl","vnd.httphone","vnd.hydrostatix.sof-data","vnd.hyper-item+json","vnd.hyper+json","vnd.hyperdrive+json","vnd.hzn-3d-crossword","vnd.ibm.afplinedata","vnd.ibm.electronic-media","vnd.ibm.MiniPay","vnd.ibm.modcap","vnd.ibm.rights-management","vnd.ibm.secure-container","vnd.iccprofile","vnd.ieee.1905","vnd.igloader","vnd.imagemeter.folder+zip","vnd.imagemeter.image+zip","vnd.immervision-ivp","vnd.immervision-ivu","vnd.ims.imsccv1p1","vnd.ims.imsccv1p2","vnd.ims.imsccv1p3","vnd.ims.lis.v2.result+json","vnd.ims.lti.v2.toolconsumerprofile+json","vnd.ims.lti.v2.toolproxy.id+json","vnd.ims.lti.v2.toolproxy+json","vnd.ims.lti.v2.toolsettings+json","vnd.ims.lti.v2.toolsettings.simple+json","vnd.informedcontrol.rms+xml","vnd.infotech.project","vnd.infotech.project+xml","vnd.informix-visionary","vnd.innopath.wamp.notification","vnd.insors.igm","vnd.intercon.formnet","vnd.intergeo","vnd.intertrust.digibox","vnd.intertrust.nncp","vnd.intu.qbo","vnd.intu.qfx","vnd.ipfs.ipns-record","vnd.ipld.car","vnd.ipld.dag-cbor","vnd.ipld.dag-json","vnd.ipld.raw","vnd.iptc.g2.catalogitem+xml","vnd.iptc.g2.conceptitem+xml","vnd.iptc.g2.knowledgeitem+xml","vnd.iptc.g2.newsitem+xml","vnd.iptc.g2.newsmessage+xml","vnd.iptc.g2.packageitem+xml","vnd.iptc.g2.planningitem+xml","vnd.ipunplugged.rcprofile","vnd.irepository.package+xml","vnd.is-xpr","vnd.isac.fcs","vnd.jam","vnd.iso11783-10+zip","vnd.japannet-directory-service","vnd.japannet-jpnstore-wakeup","vnd.japannet-payment-wakeup","vnd.japannet-registration","vnd.japannet-registration-wakeup","vnd.japannet-setstore-wakeup","vnd.japannet-verification","vnd.japannet-verification-wakeup","vnd.jcp.javame.midlet-rms","vnd.jisp","vnd.joost.joda-archive","vnd.jsk.isdn-ngn","vnd.kahootz","vnd.kde.karbon","vnd.kde.kchart","vnd.kde.kformula","vnd.kde.kivio","vnd.kde.kontour","vnd.kde.kpresenter","vnd.kde.kspread","vnd.kde.kword","vnd.kenameaapp","vnd.kidspiration","vnd.Kinar","vnd.koan","vnd.kodak-descriptor","vnd.las","vnd.las.las+json","vnd.las.las+xml","vnd.laszip","vnd.leap+json","vnd.liberty-request+xml","vnd.llamagraphics.life-balance.desktop","vnd.llamagraphics.life-balance.exchange+xml","vnd.logipipe.circuit+zip","vnd.loom","vnd.lotus-1-2-3","vnd.lotus-approach","vnd.lotus-freelance","vnd.lotus-notes","vnd.lotus-organizer","vnd.lotus-screencam","vnd.lotus-wordpro","vnd.macports.portpkg","vnd.mapbox-vector-tile","vnd.marlin.drm.actiontoken+xml","vnd.marlin.drm.conftoken+xml","vnd.marlin.drm.license+xml","vnd.marlin.drm.mdcf","vnd.mason+json","vnd.maxar.archive.3tz+zip","vnd.maxmind.maxmind-db","vnd.mcd","vnd.mdl","vnd.mdl-mbsdf","vnd.medcalcdata","vnd.mediastation.cdkey","vnd.medicalholodeck.recordxr","vnd.meridian-slingshot","vnd.MFER","vnd.mfmp","vnd.micro+json","vnd.micrografx.flo","vnd.micrografx.igx","vnd.microsoft.portable-executable","vnd.microsoft.windows.thumbnail-cache","vnd.miele+json","vnd.mif","vnd.minisoft-hp3000-save","vnd.mitsubishi.misty-guard.trustweb","vnd.Mobius.DAF","vnd.Mobius.DIS","vnd.Mobius.MBK","vnd.Mobius.MQY","vnd.Mobius.MSL","vnd.Mobius.PLC","vnd.Mobius.TXF","vnd.modl","vnd.mophun.application","vnd.mophun.certificate","vnd.motorola.flexsuite","vnd.motorola.flexsuite.adsi","vnd.motorola.flexsuite.fis","vnd.motorola.flexsuite.gotap","vnd.motorola.flexsuite.kmr","vnd.motorola.flexsuite.ttc","vnd.motorola.flexsuite.wem","vnd.motorola.iprm","vnd.mozilla.xul+xml","vnd.ms-artgalry","vnd.ms-asf","vnd.ms-cab-compressed","vnd.ms-3mfdocument","vnd.ms-excel","vnd.ms-excel.addin.macroEnabled.12","vnd.ms-excel.sheet.binary.macroEnabled.12","vnd.ms-excel.sheet.macroEnabled.12","vnd.ms-excel.template.macroEnabled.12","vnd.ms-fontobject","vnd.ms-htmlhelp","vnd.ms-ims","vnd.ms-lrm","vnd.ms-office.activeX+xml","vnd.ms-officetheme","vnd.ms-playready.initiator+xml","vnd.ms-powerpoint","vnd.ms-powerpoint.addin.macroEnabled.12","vnd.ms-powerpoint.presentation.macroEnabled.12","vnd.ms-powerpoint.slide.macroEnabled.12","vnd.ms-powerpoint.slideshow.macroEnabled.12","vnd.ms-powerpoint.template.macroEnabled.12","vnd.ms-PrintDeviceCapabilities+xml","vnd.ms-PrintSchemaTicket+xml","vnd.ms-project","vnd.ms-tnef","vnd.ms-windows.devicepairing","vnd.ms-windows.nwprinting.oob","vnd.ms-windows.printerpairing","vnd.ms-windows.wsd.oob","vnd.ms-wmdrm.lic-chlg-req","vnd.ms-wmdrm.lic-resp","vnd.ms-wmdrm.meter-chlg-req","vnd.ms-wmdrm.meter-resp","vnd.ms-word.document.macroEnabled.12","vnd.ms-word.template.macroEnabled.12","vnd.ms-works","vnd.ms-wpl","vnd.ms-xpsdocument","vnd.msa-disk-image","vnd.mseq","vnd.msign","vnd.multiad.creator","vnd.multiad.creator.cif","vnd.musician","vnd.music-niff","vnd.muvee.style","vnd.mynfc","vnd.nacamar.ybrid+json","vnd.ncd.control","vnd.ncd.reference","vnd.nearst.inv+json","vnd.nebumind.line","vnd.nervana","vnd.netfpx","vnd.neurolanguage.nlu","vnd.nimn","vnd.nintendo.snes.rom","vnd.nintendo.nitro.rom","vnd.nitf","vnd.noblenet-directory","vnd.noblenet-sealer","vnd.noblenet-web","vnd.nokia.catalogs","vnd.nokia.conml+wbxml","vnd.nokia.conml+xml","vnd.nokia.iptv.config+xml","vnd.nokia.iSDS-radio-presets","vnd.nokia.landmark+wbxml","vnd.nokia.landmark+xml","vnd.nokia.landmarkcollection+xml","vnd.nokia.ncd","vnd.nokia.n-gage.ac+xml","vnd.nokia.n-gage.data","vnd.nokia.n-gage.symbian.install","vnd.nokia.pcd+wbxml","vnd.nokia.pcd+xml","vnd.nokia.radio-preset","vnd.nokia.radio-presets","vnd.novadigm.EDM","vnd.novadigm.EDX","vnd.novadigm.EXT","vnd.ntt-local.content-share","vnd.ntt-local.file-transfer","vnd.ntt-local.ogw_remote-access","vnd.ntt-local.sip-ta_remote","vnd.ntt-local.sip-ta_tcp_stream","vnd.oasis.opendocument.base","vnd.oasis.opendocument.chart","vnd.oasis.opendocument.chart-template","vnd.oasis.opendocument.database","vnd.oasis.opendocument.formula","vnd.oasis.opendocument.formula-template","vnd.oasis.opendocument.graphics","vnd.oasis.opendocument.graphics-template","vnd.oasis.opendocument.image","vnd.oasis.opendocument.image-template","vnd.oasis.opendocument.presentation","vnd.oasis.opendocument.presentation-template","vnd.oasis.opendocument.spreadsheet","vnd.oasis.opendocument.spreadsheet-template","vnd.oasis.opendocument.text","vnd.oasis.opendocument.text-master","vnd.oasis.opendocument.text-master-template","vnd.oasis.opendocument.text-template","vnd.oasis.opendocument.text-web","vnd.obn","vnd.ocf+cbor","vnd.oci.image.manifest.v1+json","vnd.oftn.l10n+json","vnd.oipf.contentaccessdownload+xml","vnd.oipf.contentaccessstreaming+xml","vnd.oipf.cspg-hexbinary","vnd.oipf.dae.svg+xml","vnd.oipf.dae.xhtml+xml","vnd.oipf.mippvcontrolmessage+xml","vnd.oipf.pae.gem","vnd.oipf.spdiscovery+xml","vnd.oipf.spdlist+xml","vnd.oipf.ueprofile+xml","vnd.oipf.userprofile+xml","vnd.olpc-sugar","vnd.oma.bcast.associated-procedure-parameter+xml","vnd.oma.bcast.drm-trigger+xml","vnd.oma.bcast.imd+xml","vnd.oma.bcast.ltkm","vnd.oma.bcast.notification+xml","vnd.oma.bcast.provisioningtrigger","vnd.oma.bcast.sgboot","vnd.oma.bcast.sgdd+xml","vnd.oma.bcast.sgdu","vnd.oma.bcast.simple-symbol-container","vnd.oma.bcast.smartcard-trigger+xml","vnd.oma.bcast.sprov+xml","vnd.oma.bcast.stkm","vnd.oma.cab-address-book+xml","vnd.oma.cab-feature-handler+xml","vnd.oma.cab-pcc+xml","vnd.oma.cab-subs-invite+xml","vnd.oma.cab-user-prefs+xml","vnd.oma.dcd","vnd.oma.dcdc","vnd.oma.dd2+xml","vnd.oma.drm.risd+xml","vnd.oma.group-usage-list+xml","vnd.oma.lwm2m+cbor","vnd.oma.lwm2m+json","vnd.oma.lwm2m+tlv","vnd.oma.pal+xml","vnd.oma.poc.detailed-progress-report+xml","vnd.oma.poc.final-report+xml","vnd.oma.poc.groups+xml","vnd.oma.poc.invocation-descriptor+xml","vnd.oma.poc.optimized-progress-report+xml","vnd.oma.push","vnd.oma.scidm.messages+xml","vnd.oma.xcap-directory+xml","vnd.omads-email+xml","vnd.omads-file+xml","vnd.omads-folder+xml","vnd.omaloc-supl-init","vnd.oma-scws-config","vnd.oma-scws-http-request","vnd.oma-scws-http-response","vnd.onepager","vnd.onepagertamp","vnd.onepagertamx","vnd.onepagertat","vnd.onepagertatp","vnd.onepagertatx","vnd.onvif.metadata","vnd.openblox.game-binary","vnd.openblox.game+xml","vnd.openeye.oeb","vnd.openstreetmap.data+xml","vnd.opentimestamps.ots","vnd.openxmlformats-officedocument.custom-properties+xml","vnd.openxmlformats-officedocument.customXmlProperties+xml","vnd.openxmlformats-officedocument.drawing+xml","vnd.openxmlformats-officedocument.drawingml.chart+xml","vnd.openxmlformats-officedocument.drawingml.chartshapes+xml","vnd.openxmlformats-officedocument.drawingml.diagramColors+xml","vnd.openxmlformats-officedocument.drawingml.diagramData+xml","vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml","vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml","vnd.openxmlformats-officedocument.extended-properties+xml","vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml","vnd.openxmlformats-officedocument.presentationml.comments+xml","vnd.openxmlformats-officedocument.presentationml.handoutMaster+xml","vnd.openxmlformats-officedocument.presentationml.notesMaster+xml","vnd.openxmlformats-officedocument.presentationml.notesSlide+xml","vnd.openxmlformats-officedocument.presentationml.presentation","vnd.openxmlformats-officedocument.presentationml.presentation.main+xml","vnd.openxmlformats-officedocument.presentationml.presProps+xml","vnd.openxmlformats-officedocument.presentationml.slide","vnd.openxmlformats-officedocument.presentationml.slide+xml","vnd.openxmlformats-officedocument.presentationml.slideLayout+xml","vnd.openxmlformats-officedocument.presentationml.slideMaster+xml","vnd.openxmlformats-officedocument.presentationml.slideshow","vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml","vnd.openxmlformats-officedocument.presentationml.slideUpdateInfo+xml","vnd.openxmlformats-officedocument.presentationml.tableStyles+xml","vnd.openxmlformats-officedocument.presentationml.tags+xml","vnd.openxmlformats-officedocument.presentationml.template","vnd.openxmlformats-officedocument.presentationml.template.main+xml","vnd.openxmlformats-officedocument.presentationml.viewProps+xml","vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml","vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml","vnd.openxmlformats-officedocument.spreadsheetml.comments+xml","vnd.openxmlformats-officedocument.spreadsheetml.connections+xml","vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml","vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml","vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml","vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml","vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml","vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml","vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml","vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml","vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml","vnd.openxmlformats-officedocument.spreadsheetml.sheet","vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml","vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml","vnd.openxmlformats-officedocument.spreadsheetml.styles+xml","vnd.openxmlformats-officedocument.spreadsheetml.table+xml","vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml","vnd.openxmlformats-officedocument.spreadsheetml.template","vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml","vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml","vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml","vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml","vnd.openxmlformats-officedocument.theme+xml","vnd.openxmlformats-officedocument.themeOverride+xml","vnd.openxmlformats-officedocument.vmlDrawing","vnd.openxmlformats-officedocument.wordprocessingml.comments+xml","vnd.openxmlformats-officedocument.wordprocessingml.document","vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml","vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml","vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml","vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml","vnd.openxmlformats-officedocument.wordprocessingml.footer+xml","vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml","vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml","vnd.openxmlformats-officedocument.wordprocessingml.settings+xml","vnd.openxmlformats-officedocument.wordprocessingml.styles+xml","vnd.openxmlformats-officedocument.wordprocessingml.template","vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml","vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml","vnd.openxmlformats-package.core-properties+xml","vnd.openxmlformats-package.digital-signature-xmlsignature+xml","vnd.openxmlformats-package.relationships+xml","vnd.oracle.resource+json","vnd.orange.indata","vnd.osa.netdeploy","vnd.osgeo.mapguide.package","vnd.osgi.bundle","vnd.osgi.dp","vnd.osgi.subsystem","vnd.otps.ct-kip+xml","vnd.oxli.countgraph","vnd.pagerduty+json","vnd.palm","vnd.panoply","vnd.paos.xml","vnd.patentdive","vnd.patientecommsdoc","vnd.pawaafile","vnd.pcos","vnd.pg.format","vnd.pg.osasli","vnd.piaccess.application-licence","vnd.picsel","vnd.pmi.widget","vnd.poc.group-advertisement+xml","vnd.pocketlearn","vnd.powerbuilder6","vnd.powerbuilder6-s","vnd.powerbuilder7","vnd.powerbuilder75","vnd.powerbuilder75-s","vnd.powerbuilder7-s","vnd.preminet","vnd.previewsystems.box","vnd.proteus.magazine","vnd.psfs","vnd.pt.mundusmundi","vnd.publishare-delta-tree","vnd.pvi.ptid1","vnd.pwg-multiplexed","vnd.pwg-xhtml-print+xml","vnd.qualcomm.brew-app-res","vnd.quarantainenet","vnd.Quark.QuarkXPress","vnd.quobject-quoxdocument","vnd.radisys.moml+xml","vnd.radisys.msml-audit-conf+xml","vnd.radisys.msml-audit-conn+xml","vnd.radisys.msml-audit-dialog+xml","vnd.radisys.msml-audit-stream+xml","vnd.radisys.msml-audit+xml","vnd.radisys.msml-conf+xml","vnd.radisys.msml-dialog-base+xml","vnd.radisys.msml-dialog-fax-detect+xml","vnd.radisys.msml-dialog-fax-sendrecv+xml","vnd.radisys.msml-dialog-group+xml","vnd.radisys.msml-dialog-speech+xml","vnd.radisys.msml-dialog-transform+xml","vnd.radisys.msml-dialog+xml","vnd.radisys.msml+xml","vnd.rainstor.data","vnd.rapid","vnd.rar","vnd.realvnc.bed","vnd.recordare.musicxml","vnd.recordare.musicxml+xml","vnd.RenLearn.rlprint","vnd.resilient.logic","vnd.restful+json","vnd.rig.cryptonote","vnd.route66.link66+xml","vnd.rs-274x","vnd.ruckus.download","vnd.s3sms","vnd.sailingtracker.track","vnd.sar","vnd.sbm.cid","vnd.sbm.mid2","vnd.scribus","vnd.sealed.3df","vnd.sealed.csf","vnd.sealed.doc","vnd.sealed.eml","vnd.sealed.mht","vnd.sealed.net","vnd.sealed.ppt","vnd.sealed.tiff","vnd.sealed.xls","vnd.sealedmedia.softseal.html","vnd.sealedmedia.softseal.pdf","vnd.seemail","vnd.seis+json","vnd.sema","vnd.semd","vnd.semf","vnd.shade-save-file","vnd.shana.informed.formdata","vnd.shana.informed.formtemplate","vnd.shana.informed.interchange","vnd.shana.informed.package","vnd.shootproof+json","vnd.shopkick+json","vnd.shp","vnd.shx","vnd.sigrok.session","vnd.SimTech-MindMapper","vnd.siren+json","vnd.smaf","vnd.smart.notebook","vnd.smart.teacher","vnd.smintio.portals.archive","vnd.snesdev-page-table","vnd.software602.filler.form+xml","vnd.software602.filler.form-xml-zip","vnd.solent.sdkm+xml","vnd.spotfire.dxp","vnd.spotfire.sfs","vnd.sqlite3","vnd.sss-cod","vnd.sss-dtf","vnd.sss-ntf","vnd.stepmania.package","vnd.stepmania.stepchart","vnd.street-stream","vnd.sun.wadl+xml","vnd.sus-calendar","vnd.svd","vnd.swiftview-ics","vnd.sybyl.mol2","vnd.sycle+xml","vnd.syft+json","vnd.syncml.dm.notification","vnd.syncml.dmddf+xml","vnd.syncml.dmtnds+wbxml","vnd.syncml.dmtnds+xml","vnd.syncml.dmddf+wbxml","vnd.syncml.dm+wbxml","vnd.syncml.dm+xml","vnd.syncml.ds.notification","vnd.syncml+xml","vnd.tableschema+json","vnd.tao.intent-module-archive","vnd.tcpdump.pcap","vnd.think-cell.ppttc+json","vnd.tml","vnd.tmd.mediaflex.api+xml","vnd.tmobile-livetv","vnd.tri.onesource","vnd.trid.tpt","vnd.triscape.mxs","vnd.trueapp","vnd.truedoc","vnd.ubisoft.webplayer","vnd.ufdl","vnd.uiq.theme","vnd.umajin","vnd.unity","vnd.uoml+xml","vnd.uplanet.alert","vnd.uplanet.alert-wbxml","vnd.uplanet.bearer-choice","vnd.uplanet.bearer-choice-wbxml","vnd.uplanet.cacheop","vnd.uplanet.cacheop-wbxml","vnd.uplanet.channel","vnd.uplanet.channel-wbxml","vnd.uplanet.list","vnd.uplanet.listcmd","vnd.uplanet.listcmd-wbxml","vnd.uplanet.list-wbxml","vnd.uri-map","vnd.uplanet.signal","vnd.valve.source.material","vnd.vcx","vnd.vd-study","vnd.vectorworks","vnd.vel+json","vnd.verimatrix.vcas","vnd.veritone.aion+json","vnd.veryant.thin","vnd.ves.encrypted","vnd.vidsoft.vidconference","vnd.visio","vnd.visionary","vnd.vividence.scriptfile","vnd.vsf","vnd.wap.sic","vnd.wap.slc","vnd.wap.wbxml","vnd.wap.wmlc","vnd.wap.wmlscriptc","vnd.wasmflow.wafl","vnd.webturbo","vnd.wfa.dpp","vnd.wfa.p2p","vnd.wfa.wsc","vnd.windows.devicepairing","vnd.wmc","vnd.wmf.bootstrap","vnd.wolfram.mathematica","vnd.wolfram.mathematica.package","vnd.wolfram.player","vnd.wordlift","vnd.wordperfect","vnd.wqd","vnd.wrq-hp3000-labelled","vnd.wt.stf","vnd.wv.csp+xml","vnd.wv.csp+wbxml","vnd.wv.ssp+xml","vnd.xacml+json","vnd.xara","vnd.xfdl","vnd.xfdl.webform","vnd.xmi+xml","vnd.xmpie.cpkg","vnd.xmpie.dpkg","vnd.xmpie.plan","vnd.xmpie.ppkg","vnd.xmpie.xlim","vnd.yamaha.hv-dic","vnd.yamaha.hv-script","vnd.yamaha.hv-voice","vnd.yamaha.openscoreformat.osfpvg+xml","vnd.yamaha.openscoreformat","vnd.yamaha.remote-setup","vnd.yamaha.smaf-audio","vnd.yamaha.smaf-phrase","vnd.yamaha.through-ngn","vnd.yamaha.tunnel-udpencap","vnd.yaoweme","vnd.yellowriver-custom-menu","vnd.youtube.yt","vnd.zul","vnd.zzazz.deck+xml","voicexml+xml","voucher-cms+json","vq-rtcpxr","wasm","watcherinfo+xml","webpush-options+json","whoispp-query","whoispp-response","widget","wita","wordperfect5.1","wsdl+xml","wspolicy+xml","x-pki-message","x-www-form-urlencoded","x-x509-ca-cert","x-x509-ca-ra-cert","x-x509-next-ca-cert","x400-bp","xacml+xml","xcap-att+xml","xcap-caps+xml","xcap-diff+xml","xcap-el+xml","xcap-error+xml","xcap-ns+xml","xcon-conference-info-diff+xml","xcon-conference-info+xml","xenc+xml","xfdf","xhtml+xml","xliff+xml","xml","xml-dtd","xml-external-parsed-entity","xml-patch+xml","xmpp+xml","xop+xml","xslt+xml","xv+xml","yaml","yang","yang-data+cbor","yang-data+json","yang-data+xml","yang-patch+json","yang-patch+xml","yin+xml","zip","zlib","zstd"],audio:["1d-interleaved-parityfec","32kadpcm","3gpp","3gpp2","aac","ac3","AMR","AMR-WB","amr-wb+","aptx","asc","ATRAC-ADVANCED-LOSSLESS","ATRAC-X","ATRAC3","basic","BV16","BV32","clearmode","CN","DAT12","dls","dsr-es201108","dsr-es202050","dsr-es202211","dsr-es202212","DV","DVI4","eac3","encaprtp","EVRC","EVRC-QCP","EVRC0","EVRC1","EVRCB","EVRCB0","EVRCB1","EVRCNW","EVRCNW0","EVRCNW1","EVRCWB","EVRCWB0","EVRCWB1","EVS","example","flexfec","fwdred","G711-0","G719","G7221","G722","G723","G726-16","G726-24","G726-32","G726-40","G728","G729","G7291","G729D","G729E","GSM","GSM-EFR","GSM-HR-08","iLBC","ip-mr_v2.5","L8","L16","L20","L24","LPC","MELP","MELP600","MELP1200","MELP2400","mhas","mobile-xmf","MPA","mp4","MP4A-LATM","mpa-robust","mpeg","mpeg4-generic","ogg","opus","parityfec","PCMA","PCMA-WB","PCMU","PCMU-WB","prs.sid","QCELP","raptorfec","RED","rtp-enc-aescm128","rtploopback","rtp-midi","rtx","scip","SMV","SMV0","SMV-QCP","sofa","sp-midi","speex","t140c","t38","telephone-event","TETRA_ACELP","TETRA_ACELP_BB","tone","TSVCIS","UEMCLIP","ulpfec","usac","VDVI","VMR-WB","vnd.3gpp.iufp","vnd.4SB","vnd.audiokoz","vnd.CELP","vnd.cisco.nse","vnd.cmles.radio-events","vnd.cns.anp1","vnd.cns.inf1","vnd.dece.audio","vnd.digital-winds","vnd.dlna.adts","vnd.dolby.heaac.1","vnd.dolby.heaac.2","vnd.dolby.mlp","vnd.dolby.mps","vnd.dolby.pl2","vnd.dolby.pl2x","vnd.dolby.pl2z","vnd.dolby.pulse.1","vnd.dra","vnd.dts","vnd.dts.hd","vnd.dts.uhd","vnd.dvb.file","vnd.everad.plj","vnd.hns.audio","vnd.lucent.voice","vnd.ms-playready.media.pya","vnd.nokia.mobile-xmf","vnd.nortel.vbk","vnd.nuera.ecelp4800","vnd.nuera.ecelp7470","vnd.nuera.ecelp9600","vnd.octel.sbc","vnd.presonus.multitrack","vnd.qcelp","vnd.rhetorex.32kadpcm","vnd.rip","vnd.sealedmedia.softseal.mpeg","vnd.vmx.cvsd","vorbis","vorbis-config"],font:["collection","otf","sfnt","ttf","woff","woff2"],image:["aces","apng","avci","avcs","avif","bmp","cgm","dicom-rle","dpx","emf","example","fits","g3fax","gif","heic","heic-sequence","heif","heif-sequence","hej2k","hsj2","j2c","jls","jp2","jpeg","jph","jphc","jpm","jpx","jxr","jxrA","jxrS","jxs","jxsc","jxsi","jxss","ktx","ktx2","naplps","png","prs.btif","prs.pti","pwg-raster","svg+xml","t38","tiff","tiff-fx","vnd.adobe.photoshop","vnd.airzip.accelerator.azv","vnd.cns.inf2","vnd.dece.graphic","vnd.djvu","vnd.dwg","vnd.dxf","vnd.dvb.subtitle","vnd.fastbidsheet","vnd.fpx","vnd.fst","vnd.fujixerox.edmics-mmr","vnd.fujixerox.edmics-rlc","vnd.globalgraphics.pgb","vnd.microsoft.icon","vnd.mix","vnd.ms-modi","vnd.mozilla.apng","vnd.net-fpx","vnd.pco.b16","vnd.radiance","vnd.sealed.png","vnd.sealedmedia.softseal.gif","vnd.sealedmedia.softseal.jpg","vnd.svf","vnd.tencent.tap","vnd.valve.source.texture","vnd.wap.wbmp","vnd.xiff","vnd.zbrush.pcx","webp","wmf","emf","wmf"],model:["3mf","e57","example","gltf-binary","gltf+json","JT","iges","mesh","mtl","obj","prc","step","step+xml","step+zip","step-xml+zip","stl","u3d","vnd.bary","vnd.cld","vnd.collada+xml","vnd.dwf","vnd.flatland.3dml","vnd.gdl","vnd.gs-gdl","vnd.gtw","vnd.moml+xml","vnd.mts","vnd.opengex","vnd.parasolid.transmit.binary","vnd.parasolid.transmit.text","vnd.pytha.pyox","vnd.rosette.annotated-data-model","vnd.sap.vds","vnd.usda","vnd.usdz+zip","vnd.valve.source.compiled-map","vnd.vtu","vrml","x3d-vrml","x3d+fastinfoset","x3d+xml"],multipart:["appledouble","byteranges","encrypted","example","form-data","header-set","multilingual","related","report","signed","vnd.bint.med-plus","voice-message","x-mixed-replace"],text:["1d-interleaved-parityfec","cache-manifest","calendar","cql","cql-expression","cql-identifier","css","csv","csv-schema","directory","dns","ecmascript","encaprtp","enriched","example","fhirpath","flexfec","fwdred","gff3","grammar-ref-list","hl7v2","html","javascript","jcr-cnd","markdown","mizar","n3","parameters","parityfec","plain","provenance-notation","prs.fallenstein.rst","prs.lines.tag","prs.prop.logic","raptorfec","RED","richtext","rfc822-headers","rtf","rtp-enc-aescm128","rtploopback","rtx","SGML","shaclc","shex","spdx","strings","t140","tab-separated-values","troff","turtle","ulpfec","uri-list","vcard","vnd.a","vnd.abc","vnd.ascii-art","vnd.curl","vnd.debian.copyright","vnd.DMClientScript","vnd.dvb.subtitle","vnd.esmertec.theme-descriptor","vnd.exchangeable","vnd.familysearch.gedcom","vnd.ficlab.flt","vnd.fly","vnd.fmi.flexstor","vnd.gml","vnd.graphviz","vnd.hans","vnd.hgl","vnd.in3d.3dml","vnd.in3d.spot","vnd.IPTC.NewsML","vnd.IPTC.NITF","vnd.latex-z","vnd.motorola.reflex","vnd.ms-mediapackage","vnd.net2phone.commcenter.command","vnd.radisys.msml-basic-layout","vnd.senx.warpscript","vnd.si.uricatalogue","vnd.sun.j2me.app-descriptor","vnd.sosi","vnd.trolltech.linguist","vnd.wap.si","vnd.wap.sl","vnd.wap.wml","vnd.wap.wmlscript","vtt","wgsl","xml","xml-external-parsed-entity"],video:["1d-interleaved-parityfec","3gpp","3gpp2","3gpp-tt","AV1","BMPEG","BT656","CelB","DV","encaprtp","example","FFV1","flexfec","H261","H263","H263-1998","H263-2000","H264","H264-RCDO","H264-SVC","H265","H266","iso.segment","JPEG","jpeg2000","jxsv","mj2","MP1S","MP2P","MP2T","mp4","MP4V-ES","MPV","mpeg","mpeg4-generic","nv","ogg","parityfec","pointer","quicktime","raptorfec","raw","rtp-enc-aescm128","rtploopback","rtx","scip","smpte291","SMPTE292M","ulpfec","vc1","vc2","vnd.CCTV","vnd.dece.hd","vnd.dece.mobile","vnd.dece.mp4","vnd.dece.pd","vnd.dece.sd","vnd.dece.video","vnd.directv.mpeg","vnd.directv.mpeg-tts","vnd.dlna.mpeg-tts","vnd.dvb.file","vnd.fvt","vnd.hns.video","vnd.iptvforum.1dparityfec-1010","vnd.iptvforum.1dparityfec-2005","vnd.iptvforum.2dparityfec-1010","vnd.iptvforum.2dparityfec-2005","vnd.iptvforum.ttsavc","vnd.iptvforum.ttsmpeg2","vnd.motorola.video","vnd.motorola.videop","vnd.mpegurl","vnd.ms-playready.media.pyv","vnd.nokia.interleaved-multimedia","vnd.nokia.mp4vr","vnd.nokia.videovoip","vnd.objectvideo","vnd.radgamettools.bink","vnd.radgamettools.smacker","vnd.sealed.mpeg1","vnd.sealed.mpeg4","vnd.sealed.swf","vnd.sealedmedia.softseal.mov","vnd.uvvu.mp4","vnd.youtube.yt","vnd.vivo","VP8","VP9"]};function T(e){return e.split("|").map((e=>e.trim())).filter((e=>""!==e))}function q(e){const n=new Date(e);return`${n.getFullYear()}${(n.getMonth()+1).toString().padStart(2,"0")}${n.getDate().toString().padStart(2,"0")}${n.getHours().toString().padStart(2,"0")}${n.getMinutes().toString().padStart(2,"0")}00`}let R=M=class extends o{constructor(){super(...arguments),this.collections=[],this.sourceCollectionIds=new Set,this.data=void 0}async connectedCallback(){super.connectedCallback(),await this.initCollections(),this.sourceCollectionIds=new Set(new URLSearchParams(window.location.search).getAll(x).map((e=>parseInt(e))))}render(){const{collections:e,sourceCollectionIds:n}=this,t=e.filter((e=>n.has(e.id)));return d`
      <arch-alert
        .alertClass=${k.Primary}
        .message=${'Use this form to create a custom collection by filtering the contents of one or more existing source collections. You may use as many of the filtering options below as you desire and leave others blank. <a href="https://arch-webservices.zendesk.com/hc/en-us/articles/16107865758228" target="_blank">Learn about options and common choices here</a>. ARCH will email you when your custom collection is ready to use.'}
      >
      </arch-alert>

      <form @input=${this.inputHandler}>
        <label for="sources" class="required"> Source Collection(s) </label>
        <em id="sourceDesc">
          Select the collection(s) to use as the source for this custom
          collection.
        </em>
        <select
          name="sources"
          id="sources"
          aria-labelledby="source sourceDesc"
          required
          multiple
          size="8"
          ?disabled=${0===this.collections.length}
          @change=${this.sourceCollectionsChangeHandler}
        >
          ${0===this.collections.length?d`<option value="">Loading Collections...</option>`:d``}
          ${e.map((e=>d`
              <option
                value="${e.id}"
                ?selected=${n.has(e.id)}
              >
                ${e.name}
              </option>
            `))}
        </select>

        <label for="name" class="required"> Custom Collection Name </label>
        <em id="nameDesc">
          Give your custom collection a name to describe its contents.
        </em>
        <input
          type="text"
          name="name"
          id="name"
          aria-labelledby="name nameDesc"
          placeholder="${t.length>0?t[0].name:"Example Collection"} - My filters"
          required
        />

        <label for="surts"> SURT Prefix(es) </label>
        <em id="surtsDesc">
          Choose
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#document"
            target="_blank"
            >web documents</a
          >
          to include in your custom collection by their
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#surt"
            target="_blank"
            >SURT prefix/es</a
          >.
          <br />
          Separate multiple SURTs with a <code>|</code> character and no space
          in-between.
        </em>
        <input
          type="text"
          name="surtPrefixesOR"
          id="surts"
          aria-labelledby="surts surtsDesc"
          placeholder="org,archive|gov,congress)/committees"
        />

        <label for="timestampFrom"> Crawl Date (start) </label>
        <em id="timestampFromDesc">
          Specify the earliest in a range of
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#timestamp"
            target="_blank"
            >timestamps</a
          >
          to include in your custom collection, or leave blank to include all
          web documents going back to the earliest collected.
        </em>
        <input
          type="datetime-local"
          name="timestampFrom"
          id="timestampFrom"
          aria-labelledby="timestampFrom timestampFromDesc"
        />

        <label for="timestampTo"> Crawl Date (end) </label>
        <em id="timestampToDesc">
          Specify the latest in a range of
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#timestamp"
            target="_blank"
            >timestamps</a
          >
          to include in your custom collection, or leave blank to include all
          web documents up to the most recent collected.
        </em>
        <input
          type="datetime-local"
          name="timestampTo"
          id="timestampTo"
          aria-labelledby="timestampTo timestampToDesc"
        />

        <label for="status"> HTTP Status </label>
        <em id="statusDesc">
          Choose web documents to include in your custom collection by their
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#status"
            target="_blank"
            >HTTP status code/s</a
          >.
          <br />
          Separate multiple HTTP Status values with a <code>|</code> character
          and no space in-between.
        </em>
        <input
          type="text"
          name="statusPrefixesOR"
          id="status"
          aria-labelledby="status statusDesc"
          placeholder="200"
        />

        <label for="mime"> MIME Type </label>
        <em id="mimeDesc">
          Choose web documents to include in your custom collection by their
          file format/s, expressed as
          <a
            href="https://arch-webservices.zendesk.com/hc/en-us/articles/14410683244948#mime"
            target="_blank"
            >MIME type/s</a
          >.
          <br />
          Separate multiple MIMEs with a <code>|</code> character and no space
          in-between.
        </em>
        <input
          type="text"
          name="mimesOR"
          id="mime"
          aria-labelledby="mime mimeDesc"
          placeholder="text/html|application/pdf"
        />
        <br />
        <arch-sub-collection-builder-submit-button
          .validateForm=${this.validateForm.bind(this)}
          .collections=${this.collections}
          .data=${this.data}
          @submit=${this.createSubCollection}
        >
        </arch-sub-collection-builder-submit-button>
      </form>
    `}inputHandler(e){e.target.setCustomValidity(""),this.data=this.formData}async initCollections(){const e=await c.collections.get();this.collections=e.items.filter(u)}setSourceCollectionIdsUrlParam(e){const n=new URL(window.location.href);n.searchParams.delete(x),e.forEach((e=>n.searchParams.append(x,e.toString()))),history.replaceState(null,"",n.toString())}sourceCollectionsChangeHandler(e){const n=Array.from(e.target.selectedOptions).map((e=>parseInt(e.value)));this.sourceCollectionIds=new Set(n),this.setSourceCollectionIdsUrlParam(n)}static decodeFormDataValue(e,n){let t=M.fieldValueParserMap[e](n);const o=M.fieldValueValidatorMessagePairMap[e];if(void 0!==o){const[e,n]=o,d=(Array.isArray(t)?t:[t]).filter((n=>!e(n)));d.length>0&&(t=new Error(`${n}: ${d.join(", ")}`))}return t}static validateDecodedFormData(e){return"string"==typeof e.timestampFrom&&"string"==typeof e.timestampTo&&e.timestampFrom>=e.timestampTo&&(e.timestampTo=new Error("Crawl Date (end) must be later than Crawl Date (start)")),e}get formData(){const e=new FormData(this.form);let n=Object.fromEntries(Array.from(new Set(e.keys()).values()).map((n=>[n,"sources"===n?e.getAll(n):e.get(n)])).map((([e,n])=>[e,"sources"===e?n:M.decodeFormDataValue(e,n)])).filter((([,e])=>e instanceof Error||e.length>0)));return n=M.validateDecodedFormData(n),n}setFormInputValidity(e){for(const[n,t]of Object.entries(e))"sources"!==n&&this.form.querySelector(`input[name="${n}"]`).setCustomValidity(t instanceof Error?t.message:"")}async doPost(e){const{csrfToken:n}=this,t=Object.assign({},e);return Array.from(M.fieldValuePreSendPrepareMap.entries()).forEach((([e,n])=>{void 0!==t[e]&&(t[e]=Array.isArray(t[e])?t[e].map(n):n(t[e]))})),fetch("/api/collections/custom",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json","X-CSRFToken":n},mode:"cors",body:JSON.stringify(t)})}validateForm(){const{form:e,formData:n}=this;return this.setFormInputValidity(n),!!e.checkValidity()||(e.reportValidity(),!1)}get successModalContent(){return w("span",{children:["You will receive an email when your custom collection is ready to view. You will be able to access it from the ",w("a",{href:g.collections,textContent:"Collections page"})]})}async createSubCollection(e){e.preventDefault();const n=await this.doPost(this.formData),{submitButton:t}=this;n.ok?(this.form.reset(),h.showNotification("ARCH is creating your custom collection",this.successModalContent,t)):h.showError("","Could not create custom collection. Please try again.",t)}};R.styles=E,R.fieldValueParserMap={mimesOR:e=>T(e),name:e=>p(e),sources:e=>p(e),statusPrefixesOR:e=>T(e),surtPrefixesOR:e=>T(e),timestampFrom:e=>p(e),timestampTo:e=>p(e)},R.fieldValueValidatorMessagePairMap={statusPrefixesOR:[e=>v.test(e),"Please correct the invalid status code(s)"],surtPrefixesOR:[e=>f.test(e),"Please correct the invalid SURT(s)"],mimesOR:[e=>{var n;const t=e.split("/");return 2===t.length&&(null===(n=D[t[0]])||void 0===n?void 0:n.includes(t[1]))},"Please correct the invalid MIME(s)"]},R.fieldValuePreSendPrepareMap=new Map([["mimesOR",p],["name",p],["sources",p],["statusPrefixesOR",p],["surtPrefixesOR",p],["timestampFrom",e=>q(e)],["timestampTo",e=>q(e)]]),n([t({type:String})],R.prototype,"csrfToken",void 0),n([s()],R.prototype,"collections",void 0),n([s()],R.prototype,"sourceCollectionIds",void 0),n([s()],R.prototype,"data",void 0),n([r("form")],R.prototype,"form",void 0),n([r("select#source")],R.prototype,"sourceSelect",void 0),n([r("arch-sub-collection-builder-submit-button")],R.prototype,"submitButton",void 0),R=M=n([a("arch-sub-collection-builder")],R);export{R as ArchSubCollectionBuilder};
//# sourceMappingURL=arch-sub-collection-builder.js.map
