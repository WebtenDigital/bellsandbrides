import { ActionFunction } from "@remix-run/node";
import { Form, Link, useTransition } from "@remix-run/react";
import { useState } from "react";
import dashimages from "~/utils/dashimages";
import Separator from "../Separator";
import Spacer from "../Spacer";
import CTAButton from "./CTAButton";

type VendorProps={
    vendorId: number
    vendorname: string
    category: string
    baseprice: number
    slug: string
    currentlikedstatus: string
}
// CLIENT
export default function DashVendorCard(props:VendorProps) {

  return (
    <main>
        {false && <div className="flex items-center gap-3 text-sm">
        <div id="left-side-image" className="w-5/12"><Link to={`/vendor/${props.slug}`}><img src={dashimages.photography} className="rounded-2xl"/></Link></div>
            <div id="right-side" className="w-7/12">
                <Link to={`/vendor/${props.slug}`}><h2 className="text-gray-600 text-base font-bold">{props.vendorname}</h2></Link>
                <div className="py-2 flex items-center justify-between">
                  <div><svg className="h-6 w-6 fill-gray-700" viewBox="0 0 60 60"><path d="M59.989 21c-.099-1.711-2.134-3.048-6.204-4.068.137-.3.214-.612.215-.936V9h-.017C53.625 3.172 29.743 3 27 3S.375 3.172.017 9H0v6.999c.005 1.9 2.457 3.387 6.105 4.494-.05.166-.08.335-.09.507H6v6.987C2.07 28.999.107 30.317.01 32H0v6.999c.003 1.323 1.196 2.445 3.148 3.38-.073.202-.12.409-.133.621H3v6.999c.008 3.326 7.497 5.391 15.818 6.355.061.012.117.037.182.037.019 0 .035-.01.054-.011 1.604.181 3.234.322 4.847.423.034.004.064.02.099.02.019 0 .034-.01.052-.011C26.1 56.937 28.115 57 30 57c1.885 0 3.9-.063 5.948-.188.018.001.034.011.052.011.035 0 .065-.017.099-.02a96.863 96.863 0 0 0 4.847-.423c.019 0 .035.01.054.01.065 0 .121-.025.182-.037 8.321-.964 15.809-3.03 15.818-6.357V43h-.016c-.07-1.226-1.115-2.249-3.179-3.104.126-.289.195-.589.195-.9V32.46c3.59-1.104 5.995-2.581 6-4.464V21h-.011zM7 18.674v-4.831c.934.252 1.938.482 3 .691v4.881l-.37-.078A42.126 42.126 0 0 1 7 18.674zm44.771-2.192-.028-.006-.364.283c-.528.411-1.339.827-2.379 1.229v-4.757c1.189-.414 2.201-.873 3-1.376v4.138c0 .152-.08.316-.229.489zM25.175 38.983l.825.012v4.998c-.194-.002-.388-.002-.581-.005l-.26-.005c-.458-.008-.914-.019-1.367-.033l-.168-.006c-.545-.018-1.086-.041-1.623-.067v-4.992a104.147 104.147 0 0 0 3.174.098zm3.809-.003c1.007-.019 2.014-.05 3.016-.096v4.993a104.916 104.916 0 0 1-2.474.091c-.146.004-.293.006-.44.009-.357.007-.723.009-1.085.012v-4.995a113.474 113.474 0 0 0 .983-.014zm5.682 4.728-.666.05v-4.987a96.392 96.392 0 0 0 3-.243v4.966a81.624 81.624 0 0 1-2.334.214zM39 38.312a73.794 73.794 0 0 0 3-.422v4.91c-.942.166-1.943.319-3 .458v-4.946zm-21.481 5.236-.304-.031-.215-.023v-4.965a99.56 99.56 0 0 0 3 .243v4.983a96.79 96.79 0 0 1-2.481-.207zM15 38.312v4.946a69.655 69.655 0 0 1-3-.458v-4.91c.968.157 1.969.299 3 .422zm29 4.102v-4.881a44.704 44.704 0 0 0 3-.691v4.831c-.891.257-1.894.506-3 .741zM25.175 15.983l.825.012v4.993a99.16 99.16 0 0 1-4-.114v-4.989a104.147 104.147 0 0 0 3.175.098zm3.809-.003c1.007-.019 2.014-.05 3.016-.096v4.989c-.17.008-.333.02-.504.028l-.043.002c-.671.03-1.355.052-2.048.068l-.324.007c-.356.007-.72.008-1.081.012v-4.995l.825-.012.159-.003zm6 12c1.007-.019 2.014-.05 3.016-.096v4.988c-1.314.065-2.65.101-4 .115v-4.992l.825-.012.159-.003zm-9.637 4.729c-.64-.05-1.265-.105-1.875-.166l-.392-.04c-.027-.003-.053-.007-.08-.009v-4.966a99.56 99.56 0 0 0 3 .243v4.984l-.248-.016-.405-.03zm-6.202-.717c-.396-.063-.768-.131-1.145-.197v-4.904c.968.157 1.969.298 3 .422v4.946a76.718 76.718 0 0 1-1.855-.267zm12.03-4.009.825.012v4.993c-.487-.005-.978-.007-1.453-.018l-.222-.004a95.164 95.164 0 0 1-2.209-.083L28 32.878v-4.993a104.147 104.147 0 0 0 3.175.098zm10.067 4.678-.107.009c-.373.031-.758.051-1.136.078V27.77a96.392 96.392 0 0 0 3-.243v4.961c-.58.062-1.16.123-1.757.173zM17 20.49v-4.962a99.56 99.56 0 0 0 3 .243v4.978a90.68 90.68 0 0 1-3-.259zm20-.002c-.966.102-1.966.191-3 .265v-4.982a96.392 96.392 0 0 0 3-.243v4.96zm2-5.176a73.794 73.794 0 0 0 3-.422v4.902c-.948.167-1.946.321-3 .46v-4.94zm5 4.095v-4.873a44.704 44.704 0 0 0 3-.691v4.82c-.896.261-1.905.51-3 .744zm-29-4.095v4.941c-.198-.026-.404-.047-.6-.074l-.376-.055a72.39 72.39 0 0 1-1.697-.265L12 19.801v-4.91c.968.156 1.969.298 3 .421zm1 11.221v4.873a42.01 42.01 0 0 1-3-.751v-4.813c.934.252 1.938.483 3 .691zm31.907 5.284a64.384 64.384 0 0 1-2.133.336c-.253.036-.516.067-.773.1v-4.941a73.794 73.794 0 0 0 3-.422v4.91l-.094.017zM11 25.231v4.751c-1.572-.607-2.586-1.227-2.916-1.779l-.067-.112c-.006-.031-.016-.064-.017-.095v-4.141c.799.503 1.811.962 3 1.376zm-1 12.302v4.881c-.918-.195-1.765-.4-2.536-.61-.122-.034-.248-.067-.367-.102A3.537 3.537 0 0 0 7 41.674v-4.831a44.72 44.72 0 0 0 3 .69zm3 11v4.881a43.562 43.562 0 0 1-3-.741v-4.831c.934.252 1.938.483 3 .691zm2 .358c.968.157 1.969.298 3 .422v4.946a69.655 69.655 0 0 1-3-.458v-4.91zm5 .637a99.56 99.56 0 0 0 3 .243v4.987a87.083 87.083 0 0 1-3-.263v-4.967zm5 .356a104.147 104.147 0 0 0 3.174.099l.825.012v4.999a101.034 101.034 0 0 1-4-.116v-4.994zm6 .11.825-.012.159-.003c1.007-.019 2.014-.05 3.016-.096v4.993c-1.284.063-2.618.103-4 .116v-4.998zm6-.223a96.392 96.392 0 0 0 3-.243v4.966c-.961.101-1.961.19-3 .263v-4.986zm5-.459a73.794 73.794 0 0 0 3-.422v4.91c-.942.166-1.943.319-3 .458v-4.946zm5-.779a44.704 44.704 0 0 0 3-.691v4.831c-.891.257-1.894.506-3 .741v-4.881zm4.892-9.212-.341.299c-.525.463-1.4.93-2.551 1.38v-4.768c1.189-.414 2.201-.873 3-1.376v4.138a.636.636 0 0 1-.108.327zm.672-8.525a46.66 46.66 0 0 1-2.326.568c-.077.017-.159.032-.237.049v-4.879a44.704 44.704 0 0 0 3-.691v4.831l-.437.122zM2 15.996v-4.141c.799.503 1.811.962 3 1.376v4.788c-1.945-.729-2.998-1.46-3-2.023zm0 23v-4.141c.799.503 1.811.962 3 1.376V41l-.571-.222-.012.012C2.847 40.139 2.002 39.5 2 38.996zm3 11v-4.141c.799.503 1.811.962 3 1.376v4.788c-1.945-.729-2.998-1.46-3-2.023zm47 2.023v-4.787c1.189-.414 2.201-.873 3-1.376v4.138c-.001.563-1.055 1.295-3 2.025zm3-22v-4.787c1.189-.414 2.201-.873 3-1.376v4.138c-.001.563-1.055 1.295-3 2.025z"/></svg></div>
                  <p>UGX {props.baseprice}</p>
                  <div><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                <Link to={`/vendor/${props.slug}`}><CTAButton type="emptywitharrow" text="Inquire" bordercolor="peach"/></Link>
                <Form method="post">
                    {/* send back the vendor's Id - both when liked and unliked*/}
                    <input type="hidden" value={props.vendorId} name="vendor_id"/>
                    {/* heart */}
                    <button className="text-peach font-semibold" type="submit">
                        Remove 
                    </button>
                  </Form>                  
                </div>
            </div>
        </div>}

        {/* NEW DESIGN */}
        <div className="lg:w-full">
          <div id="image"><Link to={`/vendor/${props.slug}`}><img src={dashimages.venue} className="h-20 w-full object-cover object-top rounded-2xl shadow-xl"/></Link></div>
          {/* <Spacer gapsize="1"/> */}
          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-xl shadow-xl">
            <div className="flex justify-between items-center">
              <div className=""><p className="px-2 bg-[#F1B2D8] text-[#E948A9] text-xs font-semibold uppercase rounded-full">{props.category}</p></div>
              {/* trash */}
              <div><Form method="post">
                <input type="hidden" value={props.vendorId} name="vendor_id"/>
                <button type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-peach" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>                                     
                </button>
              </Form></div>
            </div>



            {/* title */}
            <Link to={`/vendor/${props.slug}`}>
              <h2 className="py- text-gray-600 text-base text-lg font-bold leading-tight">{props.vendorname}</h2>

              {/* price */}
              <div className="pt-1  flex items-end justify-between">
                <p className="pb-1 text-xs text-gray-400 font-semibold uppercase">starting price</p>
                <p className="text-xl text-gray-500 font-semibold"><span className="text-xs">UGX </span>{props.baseprice}</p>
              </div>

              <div className="py-3"><Separator bordercolor={"gray-200"}/></div>
            </Link>

            {/* request pricing */}
            <div className="flex justify-between">
              <div id="email icon">
                <svg className="h-8 w-8 fill-peach" viewBox="0 0 299.997 299.997"><path d="M149.996 0C67.157 0 .001 67.158.001 149.997c0 82.837 67.156 150 149.995 150s150-67.163 150-150C299.996 67.158 232.835 0 149.996 0zm.003 52.686 88.763 55.35H61.236l88.763-55.35zm89.869 143.737h-.009c0 8.878-7.195 16.072-16.072 16.072H76.211c-8.878 0-16.072-7.195-16.072-16.072v-84.865c0-.939.096-1.852.252-2.749l84.808 52.883c.104.065.215.109.322.169.112.062.226.122.34.179a8.903 8.903 0 0 0 1.847.721c.065.018.13.026.195.041a9.148 9.148 0 0 0 2.093.265h.015c.7 0 1.401-.099 2.093-.265.065-.016.13-.023.195-.041a8.99 8.99 0 0 0 1.847-.721 9.19 9.19 0 0 0 .34-.179c.106-.06.218-.104.322-.169l84.808-52.883c.156.897.252 1.808.252 2.749v84.865z"/></svg>
              </div>
              <div>
                <Link to="" className="flex items-center gap-2">
                  <p className="text-sm text-peach font-semibold">Request Pricing</p>
                  <div id="the-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-peach" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          </div>
        <Spacer gapsize="6"/>
    </main>
  )
}
