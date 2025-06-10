"use client"

import React, { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { 
  UserIcon,
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CogIcon,
  BuildingOfficeIcon,
  KeyIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsSections: SettingsSection[] = [
  { id: 'profile', label: 'Perfil', icon: UserIcon },
  { id: 'company', label: 'Empresa', icon: BuildingOfficeIcon },
  { id: 'notifications', label: 'Notificações', icon: BellIcon },
  { id: 'billing', label: 'Faturamento', icon: CreditCardIcon },
  { id: 'security', label: 'Segurança', icon: ShieldCheckIcon },
  { id: 'integrations', label: 'Integrações', icon: GlobeAltIcon },
  { id: 'preferences', label: 'Preferências', icon: CogIcon },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  console.log('SettingsPage rendering, activeSection:', activeSection);

  return (
    <MainLayout 
      title="Configurações" 
      subtitle="Gerencie suas configurações de conta e preferências"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200
                    ${activeSection === section.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações do Perfil</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xl font-medium">JD</span>
                  </div>
                  <div>
                    <button className="btn-outline text-sm">Alterar foto</button>
                    <p className="text-sm text-gray-600 mt-1">Formatos aceitos: JPG, PNG (máx. 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Nome completo</label>
                    <input type="text" className="form-input" defaultValue="João Designer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue="joao@designflow.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input type="tel" className="form-input" defaultValue="+55 11 99999-9999" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cargo</label>
                    <input type="text" className="form-input" defaultValue="Designer Gráfico" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea 
                    className="form-input" 
                    rows={3}
                    defaultValue="Designer gráfico especializado em identidade visual e web design."
                  />
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Salvar alterações</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'company' && (
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Empresa</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Razão Social</label>
                    <input type="text" className="form-input" defaultValue="DesignFlow Studios Ltda" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CNPJ</label>
                    <input type="text" className="form-input" defaultValue="12.345.678/0001-90" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inscrição Estadual</label>
                    <input type="text" className="form-input" defaultValue="123.456.789.012" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Regime Tributário</label>
                    <select className="form-input">
                      <option>Simples Nacional</option>
                      <option>Lucro Presumido</option>
                      <option>Lucro Real</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Endereço</label>
                  <input type="text" className="form-input" defaultValue="Rua das Flores, 123, Centro" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="form-label">Cidade</label>
                    <input type="text" className="form-input" defaultValue="São Paulo" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <input type="text" className="form-input" defaultValue="SP" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CEP</label>
                    <input type="text" className="form-input" defaultValue="01234-567" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Salvar alterações</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferências de Notificação</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Novos projetos</label>
                      <p className="text-sm text-gray-600">Receber notificações sobre novos projetos</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Tarefas atrasadas</label>
                      <p className="text-sm text-gray-600">Avisos sobre prazos perdidos</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Pagamentos</label>
                      <p className="text-sm text-gray-600">Confirmações de pagamentos recebidos</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Relatórios semanais</label>
                      <p className="text-sm text-gray-600">Resumo semanal de atividades</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Canais de notificação</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                      <label className="text-gray-900">Email</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600" />
                      <label className="text-gray-900">SMS</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                      <label className="text-gray-900">Push notifications</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Salvar preferências</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-6">
              <div className="swiss-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Plano Atual</h3>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <h4 className="font-medium text-blue-900">Professional</h4>
                    <p className="text-sm text-blue-700">Até 50 projetos ativos, relatórios avançados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-blue-900">R$ 99</p>
                    <p className="text-sm text-blue-700">por mês</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="btn-outline">Alterar plano</button>
                  <button className="btn-outline">Cancelar assinatura</button>
                </div>
              </div>

              <div className="swiss-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Histórico de Pagamentos</h3>
                <div className="space-y-3">
                  {[
                    { date: '01/01/2025', amount: 'R$ 99,00', status: 'Pago' },
                    { date: '01/12/2024', amount: 'R$ 99,00', status: 'Pago' },
                    { date: '01/11/2024', amount: 'R$ 99,00', status: 'Pago' },
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Assinatura Professional</p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{payment.amount}</p>
                        <span className="text-sm text-green-600">{payment.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Segurança da Conta</h3>
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Senha atual</label>
                  <input type="password" className="form-input" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Nova senha</label>
                  <input type="password" className="form-input" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Confirmar nova senha</label>
                  <input type="password" className="form-input" />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Autenticação de dois fatores</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">2FA via SMS</p>
                      <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                    </div>
                    <button className="btn-outline">Configurar</button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Atualizar senha</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Integrações</h3>
              <div className="space-y-6">
                {[
                  { name: 'Google Calendar', description: 'Sincronize prazos e reuniões', connected: true },
                  { name: 'Slack', description: 'Notificações de projeto no Slack', connected: false },
                  { name: 'Dropbox', description: 'Backup automático de arquivos', connected: true },
                  { name: 'Figma', description: 'Importar projetos do Figma', connected: false },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                    <button className={`
                      px-4 py-2 text-sm font-medium rounded transition-colors duration-200
                      ${integration.connected 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'btn-outline'
                      }
                    `}>
                      {integration.connected ? 'Conectado' : 'Conectar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="swiss-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferências do Sistema</h3>
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Fuso horário</label>
                  <select className="form-input">
                    <option>América/São_Paulo (GMT-3)</option>
                    <option>América/New_York (GMT-5)</option>
                    <option>Europa/London (GMT+0)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Formato de data</label>
                  <select className="form-input">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Moeda</label>
                  <select className="form-input">
                    <option>Real Brasileiro (BRL)</option>
                    <option>Dólar Americano (USD)</option>
                    <option>Euro (EUR)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Idioma</label>
                  <select className="form-input">
                    <option>Português (Brasil)</option>
                    <option>English (US)</option>
                    <option>Español</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button className="btn-primary">Salvar preferências</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}