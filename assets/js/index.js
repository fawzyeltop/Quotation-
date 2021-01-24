$(() => {
    // Compare your plan
    var counter = 0;
    const swalFire = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Sorry! You can only renew your policy within 2 Months before your policy expiry date.',
            footer: '<a href>Request quote again</a>'
          });
    }
 
    $("body").on("click", ".plus", () => {
        counter++;
        $(".years").val(counter);
        swalFire();
    });
    $("body").on("click", ".minus", () => {
        if(counter === 0) counter = 1;
        counter--;
        $(".years").val(counter);
        swalFire();
    });
    $("body").on("click", ".update, .buyGet", () => {
      swalFire();
    });

    // Success Function if needed
    const successMsg = (msg) => {
        $(".notificationSuccess")
            .html(
                `
                    <div class="cancelNotificationSuccess text-white" id="cancelNotificationSuccess">x</div>
                    <audio autoplay class="d-none">
                    <source src="
                    /assets/sounds/notification.mp3" type="audio/mpeg">
                    </audio>
                    <h4 class="text-white">Notification</h4>
                    <p class="mb-0 text-white" style="font-size: 14px">${msg}</p>
                `
            )
            .show(100)
            .delay(2000)
            .hide(100);
    }


    // Error Function
    const errorMsg = (msg) => {
        $(".notificationError")
            .html(
                `
                    <div class="cancelNotificationError text-white" id="cancelNotificationError">x</div>
                    <audio autoplay class="d-none">
                    <source src="
                    /assets/sounds/notification.mp3" type="audio/mpeg">
                    </audio>
                    <h4 class="text-white">Notification <i class="fas fa-exclamation-triangle"></i></h4>
                    <p class="mb-0 text-white" style="font-size: 14px; color: white">${msg}</p>
                `
            )
            .show(100)
            .delay(2000)
            .hide(100);
    }

    // Close both notifications (Success & Error)
    $("body").on("click", ".cancelNotificationSuccess", () => {
        $(".notificationSuccess").hide();
    });

    $("body").on("click", ".cancelNotificationError", () => {
        $(".notificationError").hide();
    });
    


    // StepJS
    const form = $("#wizard").show();
    $(".wizard>.steps .first a span.number").html(`<i class="far fa-check-circle"></i>`);
    form.children("div").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        titleTemplate: '<span class="number">#index#</span> #title#',
        onStepChanging:  (event, currentIndex, newIndex) => {
            if (currentIndex > newIndex) {
                 return true;
            }
            if(newIndex === 3) {
                // Here is the back-end team will make Request to the Server-Side for Vehicle Details
                const locationNo = $(".locationNo").val();
                const registrationNo = $(".registrationNo").val();
                const nricNumberNo = $(".nricNumberNo").val();
                console.log(locationNo, registrationNo, nricNumberNo);
                const config = {
                     method: 'POST',
                     headers: {
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({ 
                         locationNo: locationNo, 
                         registrationNo: registrationNo, 
                         nricNumberNo: nricNumberNo 
                     })
                 };
                 try {
                    (async () => {
                         const fetchResponse = await fetch(`https://www.example.com/getVechDetails`, config);
                         const data = await fetchResponse.json();
                         return data;
                    })()
                 } catch (err) {
                     console.log(err.message);
                 }   
             }
           
            if(currentIndex === 0) {
                const obj = Location_Validation();
                if (obj.status === false) {
                    errorMsg(obj.msg);
                    return false;
                } else if(obj.status === true) {
                    return true;
                }
            }
            if(currentIndex === 1) {
                const obj = Registration_Validation();
                if (obj.status === false) {
                    errorMsg(obj.msg);
                    return false;
                } else if(obj.status === true) {
                    return true;
                }
            }
            if(currentIndex === 2) {
                const obj = NRIC_Validation();
                if (obj.status === false) {
                    errorMsg(obj.msg);
                    return false;
                } else if(obj.status === true) {
                    return true;
                }
            }
            if(currentIndex === 3) {
                return true;
            }
            if(currentIndex === 4) {
                const obj = emailPhone_Validation();
                if (obj.status === false) {
                    errorMsg(obj.msg);
                    return false;
                } else if(obj.status === true) {
                    return true;
                }
             }
        },
        onStepChanged: (event, currentIndex, newIndex) => {
            const percentage = (currentIndex + 1) * (100 / 6);
            $(".progress-bar").attr("style", `width: ${percentage}%`);
            $("#percentage").text(`${percentage}%`);
        },
        onFinishing: function (event, currentIndex) {
           return true;
        },
        onFinished: function (event, currentIndex) {
           // After finishing all the steps, this function will be fired
           console.log('onFinished');
           alert('onFinished');
           setTimeout(() => {
            window.location.reload();
           }, 3000);
        }
    })
    $('[data-toggle="tooltip"]').tooltip()
});

