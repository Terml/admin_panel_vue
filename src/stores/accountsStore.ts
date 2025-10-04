import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Account {
  tags: string
  type: 'local' | 'ldap'
  login: string
  password: string | null
  showPassword: boolean
  errors: {
    tags?: string
    login?: string
    password?: string
  }
}

export interface SavedAccount {
  tags: Array<{ text: string }>
  type: 'local' | 'ldap'
  login: string
  password: string | null
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const savedAccounts = ref<SavedAccount[]>([])
  const loadFromStorage = () => {
    const stored = localStorage.getItem('admin-panel-accounts')
    if (stored) {
      try {
        savedAccounts.value = JSON.parse(stored)
        accounts.value = savedAccounts.value.map(saved => ({
          tags: saved.tags.map(tag => tag.text).join(';'),
          type: saved.type,
          login: saved.login,
          password: saved.password || '',
          showPassword: false,
          errors: {}
        }))
      } catch (error) {
        console.error('Ошибка загрузки данных из localStorage:', error)
      }
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem('admin-panel-accounts', JSON.stringify(savedAccounts.value))
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }

  const addAccount = () => {
    const newAccount: Account = {
      tags: '',
      type: 'local' as 'local' | 'ldap',
      login: '',
      password: '',
      showPassword: false,
      errors: {}
    }
    newAccount.errors = validateAccount(newAccount)
    accounts.value.push(newAccount)
    saveAccounts()
  }

  const deleteAccount = (index: number) => {
    accounts.value.splice(index, 1)
    savedAccounts.value.splice(index, 1)
    saveToStorage()
  }

  const togglePassword = (index: number) => {
    const account = accounts.value[index]
    if (account) {
      account.showPassword = !account.showPassword
    }
  }

  const validateAccount = (account: Account) => {
    const errors: { tags?: string; login?: string; password?: string } = {}

    if (account.tags && account.tags.length > 50) {
      errors.tags = 'Метки не должны превышать 50 символов'
    }

    if (!account.login.trim()) {
      errors.login = 'Логин обязателен для заполнения'
    } else if (account.login.length > 100) {
      errors.login = 'Логин не должен превышать 100 символов'
    }

    if (account.type === 'local') {
      if (!account.password || account.password === '' || account.password.trim() === '') {
        errors.password = 'Пароль обязателен для заполнения'
      } else if (account.password && account.password.length > 100) {
        errors.password = 'Пароль не должен превышать 100 символов'
      }
    }

    return errors
  }

  const saveAccounts = () => {
    savedAccounts.value = accounts.value.map(account => ({
      tags: account.tags
        .split(';')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => ({ text: tag })),
      type: account.type,
      login: account.login,
      password: account.type === 'local' ? account.password : null
    }))
    
    saveToStorage()
  }

  const onTagsChange = (index: number, value: string) => {
    const account = accounts.value[index]
    if (account) {
      account.tags = value
      account.errors.tags = validateAccount(account).tags
      saveAccounts()
    }
  }

  const onLoginChange = (index: number, value: string) => {
    const account = accounts.value[index]
    if (account) {
      account.login = value
      account.errors.login = validateAccount(account).login
      saveAccounts()
    }
  }

  const onPasswordChange = (index: number, value: string) => {
    const account = accounts.value[index]
    if (account) {
      account.password = value
      account.errors.password = validateAccount(account).password
      saveAccounts()
    }
  }

  const onTypeChange = (index: number, value: 'local' | 'ldap') => {
    const account = accounts.value[index]
    if (account) {
      account.type = value
      if (value === 'ldap') {
        account.password = null
        account.errors.password = undefined
      } else {
        account.password = ''
      }
      account.errors = {}
      account.errors = validateAccount(account)
      saveAccounts()
    }
  }

  const hasValidAccounts = computed(() => {
    return accounts.value.every(account => {
      const errors = validateAccount(account)
      return !errors.login && !errors.password && !errors.tags
    })
  })

  const accountsCount = computed(() => accounts.value.length)

  loadFromStorage()

  return {
    accounts,
    savedAccounts,
    
    loadFromStorage,
    saveToStorage,
    addAccount,
    deleteAccount,
    togglePassword,
    validateAccount,
    saveAccounts,
    onTagsChange,
    onLoginChange,
    onPasswordChange,
    onTypeChange,
    
    hasValidAccounts,
    accountsCount
  }
})
