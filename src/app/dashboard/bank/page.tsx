import { db } from '@/drizzle/db';
import { BankAccountTable, bankProviders, ApartmentTable } from '@/drizzle/schema';
import App from '../../../components/Sidebar/App';
import AddBankAccountForm from './AddBankAccountForm';
import DeleteBankAccountButton from './DeleteBankAccountButton';
import BankProviderLogo from './BankProviderLogo';
import AssociateApartmentsButton from './AssociateApartmentsButton';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
// import SettingNav from '@/components/settingnav';

export default async function BankPage() {
  // TODO: Replace with actual user ID from session/auth
  const currentUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  const bankAccounts = await db.select().from(BankAccountTable).where(eq(BankAccountTable.userId, currentUser.id));
  const apartments = await db.select().from(ApartmentTable).where(eq(ApartmentTable.userId, currentUser.id));

  return (
    <App title="บัญชีธนาคาร" userName={currentUser.name || "Demo User"}>
      {/* <SettingNav /> */}
      
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#018c98] to-cyan-600 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">บัญชีธนาคาร</h1>
            <p className="text-blue-100 text-sm">
              จัดการบัญชีธนาคารและพร้อมเพย์ของคุณ
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddBankAccountForm bankProviders={bankProviders} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">บัญชีทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{bankAccounts.length}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Bank Accounts List */}
      <div className="space-y-4">
        {bankAccounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีบัญชีธนาคาร</h3>
            <p className="text-gray-500 mb-4">เริ่มต้นโดยการเพิ่มบัญชีธนาคารหรือพร้อมเพย์ของคุณ</p>
            <AddBankAccountForm bankProviders={bankProviders} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <BankProviderLogo bankProvider={account.bankProvider} className="max-w-16 h-auto" />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {account.bankProvider === 'promptpay' ? 'พร้อมเพย์' : 'ธนาคาร'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {account.bankProvider === 'promptpay' ? 'พร้อมเพย์' : account.bankProvider}
                      </h3>
                      <p className="text-gray-600 font-medium mb-1">{account.name}</p>
                      <p className="text-sm text-gray-500 font-mono">{account.bankNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <AssociateApartmentsButton 
                      accountId={account.id} 
                      accountName={account.name}
                      apartments={apartments}
                    />
                    <DeleteBankAccountButton accountId={account.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </App>
  );
}

