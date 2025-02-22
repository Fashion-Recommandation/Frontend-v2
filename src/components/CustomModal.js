import React from "react";

const CustomModal = ({ setShowModal }) => {
    return (
        <div className="modal-container">

            <div className="ui active longer modal">
                <button className='ui button' onClick={() => setShowModal(false)}>بستن</button>
                <div className="header" style={{ fontFamily: 'Vazir' }}>خوش‌آمد گویی و معرفی</div>

                <div class="description">
                    <p>
                        سلااام سلااااام
                        (:</p>
                    <p> از اینکه در آزمایش ما شرکت می‌کنید ازتون ممنونیم.</p>
                    <p>
                        در اینجا شما می‌تونید یک تصویری از لباس، شلوار یا دامن خودتون رو اینجا آپلود کنید
                        بعد نوع تصویری که آپلود کردید رو انتخاب کنید و روی دکمه سبز رنگ کلیک کنید.
                    </p>
                    <p>حالا ما کارمون رو شروع میکنیم و براتون میگردیم تا یک لباس زیبا پیدا کنیم که بتونید
                        با چیزی که آپلود کردید ست کنید.
                        <br />
                        توی این مرحله باید یکمی صبور باشید...
                        <br />
                    </p>
                    <p>
                        بعد از گذشت چند ثانیه، شما میتونید پیشنهادهای ما رو ببینید.
                        <br />
                        <strong className="important-description">دقت کنید که ما تکسچر و طرح لباس رو به شما سپردیم و چیزی که پیشنهاد میدیم مدل لباسه.</strong>
                        <br />
                        مثلا اگر برای تیشرتی که شما ارائه دادید یک شلوار بوت کات پیشنهاد دادیم
                        انتخاب طرح ورنگش رو به خود شما سپردیم که از کمدتون بتونید یه شلوار با مدل مشابه انتخاب کنید.
                    </p>
                    <p>
                        در آخر یک فرمی برای شما نمایش داده میشه که به ما کمک میکنه تا کارمون رو بهبود بدیم.
                        لطفا فرم رو پر کنید و برای دوستاتون بفرستید ;)
                    </p>
                    <p>
                        اگر سوالی یا انتقادی داشتید میتونید به
                        id:sara_zhd
                        توی تلگرام پیام بدید.
                        یا به ایمیل
                        &nbsp;
                        <a href="mailto:sarazm.2000@gmail.com">sarazm.2000@gmail.com</a>&nbsp;
                        ایمیل بزنید.
                    </p>
                </div>

            </div>
        </div>

    )
}

export default CustomModal;