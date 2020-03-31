import { computed, ref } from '@vue/composition-api'
import { AddressModel, AddressInterface } from '@/address/address-model'
export interface PartyCodeInterface {
  clientCode: string;
  business: string;
  address?: AddressInterface;
  contact?: string;
  description?: string;
}

export class PartyCodeModel {
  public clientCode: string
  public business: string
  public address: AddressModel
  public contact: string
  public description: string
  // public toJson(): PartyCodeInterface {
  //   let rval = {}
  //   return rval
  // }
  //
  public static fromJson(jsonObject: PartyCodeInterface | undefined): PartyCodeModel {
    const result = new PartyCodeModel()
    result.clientCode = jsonObject.clientCode
    result.business = jsonObject.business
    result.address = AddressModel.fromJson(jsonObject.address)
    result.contact = jsonObject.contact
    result.description = jsonObject.description
    return result
  }
}

function getDefs() {
  const _partyList = PartiesList()
  const partyList = ref(_partyList)

  function findPartyByCompanyName( companyName: string ): PartyCodeInterface {
    return _partyList.find( element => element.business === companyName)
  }

  function findPartyByCode( clientCode: string ): PartyCodeInterface {
    const rval =  _partyList.find( element => element.clientCode === clientCode)
    return rval
  }

  return {
    findPartyByCode,
    findPartyByCompanyName,
    partyList
  }
}
const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function usePartyCodes () {
  return Instance()
}

export function PartiesList(): PartyCodeInterface[] {
  let _cnt = 100;
  const list = [
    {
      clientCode: '' + _cnt++,
      business: "BC Registries",
      address: {
        street: "840 Broughton",
        city: "Victoria",
        province: "BC",
        postal: " XnX YnY",
        country: "Canada"
      },
      contact:"Carol"
    },
    {
      clientCode: '' + _cnt++,
      business: "Dye and Durham",
      address: {
        street: "123 Front St",
        city: "Vancouver",
        province: "BC",
        postal: " XnX YnY",
        country: "Canada"
      },
      contact:"Darlene Dunn"
    },
    {
      clientCode: '' + _cnt++,
      business: "Big Bank",
      address: {
        street: "897 Bank St",
        city: "Victoria",
        province: "BC",
        postal: " XnX YnY",
        country: "Canada"
      },
      contact:"Adam Minister"
    },
    {
      clientCode: '' + _cnt++,
      business: "Andrew's Used Cars",
      address: {
        street: "999 Fast St",
        city: "Vancouver",
        province: "BC",
        postal: " XnX YnY",
        country: "Canada"
      },
      contact:"Andrew Lodge"
    },
  ]
  const result: PartyCodeInterface[] = list.map( json => PartyCodeModel.fromJson(json))
  return result
}