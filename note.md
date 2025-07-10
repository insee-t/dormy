in meter page should I handle for each cell. if not paymentPlan tell user "ลูกเช่ายังไม่สมัครเว็ปไซต์"

does reload page after save forrm with redirect work with apartment selection (with searchParams). 
    it doesn't.

change implementation of sendall to just send for current apartment.

ส่งทั้งหมด function are link all electric/water of current month (previous month if wasn't already link) to tenantId (if tenant already register to that room). don't do that save again. these function are separate.

mock by change date and month in environment.

need to implement send to email feature like you said. 

if Newt want to work. then line function are what should be implement

fix redirect if there are not search result.

implement send bill for each tenant.

in rent bill. status should include "doesn't send yet" paid,


implement advance filtering system later. like all the tenant in the same page. but filter with apartment.

don't forget to change secure: true, in session.ts when deploy.

excel export function aren't that hard.

copy button like in complaints page.

implement Ter notification again.

implement Tenant (ผุ้เช่า) page later.

even settings. lease creation shouldn't be in settings.

redirect register correctly (according to role).

user shouldn't be able to access admin page.

fix register tenant rent logic.

# need to fix the whole save thing. Or is it? I mean does it really need to send at the same time? I don't think so.
# KISS. no

## Right now save and send are doing the same thing. so remove send button and change save label to send.

# bank should be in setting.

# redesign how to change bank for each apartmennt.

# how do I make sure redis max client error doesn't happen in production.

# if payment got reject it need to display on tenant dashboard page.

# implement middleware

# meter calculation.

# no need for review-reciept ratio

// review-reciept

        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">รายการชำระค่าเช่า</h1>
            <p className="text-gray-600 mt-1">ตรวจสอบรายการชำระเงินของผู้เช่าและหลักฐานจากแอปธนาคาร</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ส่งออก
            </Button>
            <Button className=" bg-[#01bcb4] hover:bg-cyan-600">
              <Filter className="h-4 w-4 mr-2 " />
              ตัวกรองขั้นสูง
            </Button>
          </div>
        </div>


// tenant/dashboard

              <Link href="/tenant/profile">
                <Button className="w-full justify-start" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  อัปเดตโปรไฟล์
                </Button>
              </Link>
## maintanance type display in thai.

# no need to show how much in meter page.

# update status if tenant upload.

# handle correctly if tenant go to /tenant/
## add back button to tenant

# make lease page fetch auto fill.

# make manage lease button.
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">จัดการสัญญา</h3>
              <p className="text-sm text-gray-600 mb-3">
                ดูและจัดการสัญญาเช่าทั้งหมดในระบบ
              </p>
              <Button
                variant="light"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full"
              >
                จัดการสัญญา
              </Button>
            </div>


# If no tenant it shouldn't be in review page.

need to implement no negative bill.

people are dumb they may insert meter incorrect in the prev Month

# need to change favicon and title. and all seo actually.

# need to visable say that it require to be save to click. also cursor.

# forgot to make it say loading... server puppeteer. also forget to implement username in app.

# we kinda need to make sure it secure with accept tennat function. or password but I think password are too much.

# Change all linkco to dormy.

# require user to enter real thai name (no last name).

# DONE current flow are wrong. payment plan should be static. and rent are monthly.

# nav bar reload