<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h1 class="h4 mb-0">Учетные записи</h1>
             <button class="btn btn-outline-primary btn-sm" @click="store.addAccount">
               <i class="bi bi-plus"></i> Добавить
             </button>
          </div>
          <div class="card-body">
            <div class="alert alert-info d-flex align-items-center mb-3">
              <i class="bi bi-info-circle me-2"></i>
              <small>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</small>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th style="width: 20%">Метки</th>
                    <th style="width: 15%">Тип записи</th>
                    <th style="width: 25%">Логин</th>
                    <th style="width: 25%">Пароль</th>
                    <th style="width: 15%">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="store.accounts.length === 0">
                    <td :colspan="5" class="text-center text-muted py-4">
                      <i class="bi bi-inbox me-2"></i>
                      Нет учетных записей
                    </td>
                  </tr>
                  <tr v-for="(account, index) in store.accounts" :key="index">
                    <td>
                      <div class="position-relative">
                        <input :value="account.tags"
                          @input="store.onTagsChange(index, ($event.target as HTMLInputElement).value)" type="text"
                          class="form-control form-control-sm" :class="{ 'is-invalid': account.errors.tags }"
                          placeholder="Значение" maxlength="50" />
                        <div v-if="account.errors.tags" class="invalid-feedback">
                          {{ account.errors.tags }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <select :value="account.type"
                         @change="store.onTypeChange(index, ($event.target as HTMLSelectElement).value as 'local' | 'ldap')"
                        class="form-select form-select-sm">
                        <option value="local">Локальная</option>
                        <option value="ldap">LDAP</option>
                      </select>
                    </td>
                    <td v-if="account.type === 'local'">
                      <div class="position-relative">
                        <input :value="account.login"
                           @input="store.onLoginChange(index, ($event.target as HTMLInputElement).value)" type="text"
                          class="form-control form-control-sm" :class="{ 'is-invalid': account.errors.login }"
                          placeholder="Значение" maxlength="100" />
                        <div v-if="account.errors.login" class="invalid-feedback">
                          {{ account.errors.login }}
                        </div>
                      </div>
                    </td>
                    <td v-if="account.type === 'ldap'" colspan="2">
                      <div class="position-relative">
                        <input :value="account.login"
                           @input="store.onLoginChange(index, ($event.target as HTMLInputElement).value)" type="text"
                          class="form-control form-control-sm" :class="{ 'is-invalid': account.errors.login }"
                          placeholder="Значение" maxlength="100" />
                        <div v-if="account.errors.login" class="invalid-feedback">
                          {{ account.errors.login }}
                        </div>
                      </div>
                    </td>
                    <td v-if="account.type === 'local'">
                      <div class="position-relative">
                        <div class="input-group input-group-sm">
                          <input :value="account.password"
                             @input="store.onPasswordChange(index, ($event.target as HTMLInputElement).value)"
                            :type="account.showPassword ? 'text' : 'password'" class="form-control"
                            :class="{ 'is-invalid': account.errors.password }" placeholder="Значение" maxlength="100" />
                          <button class="btn btn-outline-secondary" type="button" @click="store.togglePassword(index)"
                            :title="account.showPassword ? 'Скрыть пароль' : 'Показать пароль'">
                            <i :class="account.showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                          </button>
                        </div>
                        <div v-if="account.errors.password" class="invalid-feedback">
                          {{ account.errors.password }}
                        </div>
                      </div>
                    </td>
                    <td class="text-center">
                       <button class="btn btn-outline-danger btn-sm" @click="store.deleteAccount(index)"
                        title="Удалить запись">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '../stores/accountsStore'

const store = useAccountsStore()
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
}

.table th {
  border-top: none;
  font-weight: 600;
  font-size: 0.875rem;
}

.table td {
  vertical-align: middle;
  padding: 0.75rem;
  height: 80px;
}

.form-control-sm,
.form-select-sm {
  font-size: 0.875rem;
}

.invalid-feedback {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0;
  max-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #dc3545;
  display: block !important;
  width: 100%;
}

.position-relative {
  position: relative !important;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
  }
}
</style>
