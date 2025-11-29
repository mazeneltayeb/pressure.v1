import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getUsers() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching profiles:', error)
      return []
    }

    return profiles || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-right">قائمة المستخدمين</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border text-right">الاسم الكامل</th>
              <th className="px-4 py-2 border text-right">اسم المستخدم</th>
              <th className="px-4 py-2 border text-right">البريد الإلكتروني</th>
              <th className="px-4 py-2 border text-right">الهاتف</th>
              <th className="px-4 py-2 border text-right">عنوان المتجر</th>
              <th className="px-4 py-2 border text-right">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-right">{user.full_name || '---'}</td>
                <td className="px-4 py-2 border text-right">{user.username || '---'}</td>
                <td className="px-4 py-2 border text-right">{user.email}</td>
                <td className="px-4 py-2 border text-right">{user.phone || '---'}</td>
                <td className="px-4 py-2 border text-right">{user.store_address || '---'}</td>
                <td className="px-4 py-2 border text-right">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">لا توجد بيانات للمستخدمين</div>
        )}
      </div>
    </div>
  )
}