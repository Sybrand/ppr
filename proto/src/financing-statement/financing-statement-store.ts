import { ref } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementInterface, FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { SecuredPartyModel} from '@/secured-parties/secured-party-model.ts'
import { useRegisteredParty } from '@/registering-party/registering-party-model'
import { useUsers } from '@/users/users'


function getDefs() {
  const financingStatementsList = ref(_loadList())

  function createFinancingStatement(): FinancingStatementModel {
    const { createFromCurrentUser } = useRegisteredParty()
    const firstSecuredParty = new SecuredPartyModel()
    firstSecuredParty.listId = 0
    const securedParties = [firstSecuredParty]
    const firstDebtor = new BasePartyModel()
    firstDebtor.listId = 0
    const debtorParties = [firstDebtor]
    const registeringParty = createFromCurrentUser()
    return new FinancingStatementModel(FinancingStatementType.SECURITY_AGREEMENT, 5, registeringParty, securedParties, debtorParties)
  }

  function findFinancingStatement( regNum: string) {
    return financingStatementsList.value.find( element => {
      return element.baseRegistrationNumber === regNum
    })
  }

  function registerFinancingStatement( fs: FinancingStatementModel): string {
    fs.registerLien()
    financingStatementsList.value.push(fs)
    _saveList()
    return fs.baseRegistrationNumber
  }

  function clearFinancingStatementStash() {
    localStorage.removeItem('fslist')
  }

  function getFinancingStatementStash(): string {
    return localStorage.getItem('fslist')
  }

  function loadFinancingStatementStash(jsonString): void {
    localStorage.setItem('fslist', jsonString)
    _loadList()
  }

  function getUsersFinancingStatementList() {
    const { currentUser } = useUsers()
    const party = currentUser.value.party
    const cc = party.clientCode
    const usersList = financingStatementsList.value.filter((fs) => {
      return fs.registeringParty.clientCode === cc
    })
    return usersList
  }


  // Private methods

  function _loadList(): FinancingStatementInterface[] {
    const stash = localStorage.getItem('fslist')
    const list: FinancingStatementInterface[] = []
    if(stash) {
      try {
        let asStored: FinancingStatementInterface[] = JSON.parse(stash)
        asStored.forEach((jsonStr: FinancingStatementInterface): number => list.push(FinancingStatementModel.fromJson(jsonStr)))
      } catch(error) {
        console.error("Error parsing financing statement list", error)
      }
    }
    return list
  }
  function _saveList() {
    let list = []
    financingStatementsList.value.forEach((element: FinancingStatementModel) => list.push(element.toJson()))
    localStorage.setItem('fslist', JSON.stringify(list))
  }

  return {
    // refs
    financingStatementsList,
    // functions
    createFinancingStatement,
    clearFinancingStatementStash,
    getFinancingStatementStash,
    getUsersFinancingStatementList,
    loadFinancingStatementStash,
    findFinancingStatement,
    registerFinancingStatement
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useFinancingStatements () {
  return Instance()
}
