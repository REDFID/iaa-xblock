function IterativeAssessedActivityStudio(runtime, element) {


    let MAX_STAGES = 15;    
    let ALL_STAGES = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15";
    let context = $("#context-iaa").data()["context"];
    let activities = JSON.parse(context["activities"]);
    let input_title = $(element).find("#input_title");
    let title = $(element).find("#title");
    let input_activity_name = $(element).find('#input_activity_name');
    let activity_name = $(element).find("#activity_name");
    let input_new_activity_name = $(element).find("#input_new_activity_name");
    let new_activity_name = $(element).find("#new_activity_name");
    let input_block_type = $(element).find("#input_block_type");
    let block_type = $(element).find("#block_type");
    let input_activity_stage = $(element).find("#input_activity_stage");
    let activity_stage = $(element).find("#activity_stage");
    let input_stage_label = $(element).find("#input_stage_label");
    let stage_label = $(element).find("#stage_label");
    let input_activity_previous = $(element).find("#input_activity_previous");
    let activity_previous = $(element).find("#activity_previous");
    let input_display_title = $(element).find("#input_display_title");
    let display_title = $(element).find("#display_title");
    let input_activity_name_previous = $(element).find("#input_activity_name_previous");
    let activity_name_previous = $(element).find("#activity_name_previous");
    let input_activity_stage_previous = $(element).find("#input_activity_stage_previous");
    let activity_stage_previous = $(element).find("#activity_stage_previous");
    let input_question = $(element).find("#input_question");
    let question = $(element).find("#question");
    let input_summary_text = $(element).find("#input_summary_text");
    let summary_text = $(element).find("#summary_text");

    function validate(data) {
        if (data["title"] === ""){
            return "Por favor indique el título del bloque."
        }
        if (data["block_type"] === null){
            return "Por favor indique el tipo de bloque."
        } else if (data["block_type"] === "full"){
            if (data["activity_name"] === "none" || data["activity_name"] === ""){
                return "Por favor indique el nombre de la actividad."
            }
            if (activity_name.val() === "new"){
                for (let activity of activities){
                    if (data["activity_name"] === activity["activity_name"]){
                        return "Ya existe en este curso una actividad con ese nombre."
                    }
                }
            }
            if (data["activity_stage"] === "none"){
                return "Por favor selecciona la fase de la actividad."
            }
            if (data["stage_label"] === ""){
                return "Por favor proporcione una etiqueta para esta fase."
            }
            if (data["question"] === ""){
                return "Por favor proporcione un enunciado para esta fase."
            }
            if (data["activity_previous"] === "yes"){
                if (data["activity_name_previous"] === "none"){
                    return "Por favor indique el nombre de la actividad de la cual se mostrará una respuesta anterior."
                }
                if (data["activity_stage_previous"] != null){
                    if (data["activity_stage_previous"] === "none"){
                        return "Por favor selecciona la fase de la actividad de la cual se mostrará una respuesta anterior."
                    }
                } else {
                    return "No se cuenta aún con otras respuestas para desplegar."
                }
                if (data["display_title"] === ""){
                    return "Por favor proporcione un título a la respuesta anterior."
                }
            }
        } else if (data["block_type"] === "display"){
            if (data["activity_name_previous"] === "none"){
                return "Por favor indique el nombre de la actividad de la cual se mostrará una respuesta anterior."
            }
            if (data["activity_stage_previous"] === "none"){
                return "Por favor selecciona la fase de la actividad de la cual se mostrará una respuesta anterior."
            }
            if (data["display_title"] === ""){
                return "Por favor proporcione un título a la respuesta anterior."
            }
        } else {
            if (data["activity_name"] === "none"){
                return "Por favor indique el nombre de la actividad."
            }
            if (data["summary_text"] === ""){
                return "Por favor indique el texto de resumen."
            }
        }
        return "";
    }

    function showMessage(msg) {
        $(element).find('.iaa-studio-error-msg').html(msg);
    }

    function handlePrevious(previous_values){

        // Bloque full
        if (previous_values["show"]){
            previous = activity_previous.val() === "yes";

            // Bloque full con respuesta anterior
            if (previous){
                var selected = false;
                input_activity_name_previous.removeAttr("hidden");
                activity_name_previous.empty();
                for (let activity of activities) {
                    let opt = document.createElement("option");
                    opt.value = activity[1];
                    opt.text = activity[1];
                    if (previous_values["previous_activity_name"] == activity[1]){
                        opt.setAttribute("selected", true);
                        selected = true;
                    }
                    activity_name_previous.append(opt);
                }
                let opt0 = document.createElement("option");
                opt0.value = "none";
                opt0.text = "Por favor seleccione una opción...";
                opt0.setAttribute("disabled", true);
                if (!selected){
                    opt0.setAttribute("selected", true);
                }
                activity_name_previous.append(opt0);
                activity_name_previous.on("change", function () {
                    activity_stage_previous.empty();
                    let current_activity = (activity_name.val() === "new" ? new_activity_name : activity_name.val());
                    let current_stage = activity_stage.val();
                    for (let activity of activities) {
                        if (activity[1] === activity_name_previous.val()) {
                            stages = activity[2].split(",");
                            for(let stage of stages){
                                if (!(current_activity === activity[1] && current_stage === stage)){
                                    let opt = document.createElement('option');
                                    opt.value = stage;
                                    opt.text = stage;
                                    activity_stage_previous.append(opt);
                                }
                            }
                            if( activity_stage_previous.has('option').length > 0 ){
                                let opt0 = document.createElement("option");
                                opt0.value = "none";
                                opt0.text = "Por favor seleccione una opción...";
                                opt0.setAttribute("disabled", true);
                                opt0.setAttribute("selected", true);
                                activity_stage_previous.append(opt0);
                                input_activity_stage_previous.removeAttr("hidden");
                            } else {
                                activity_stage_previous.empty();
                            }
                        }
                    }
                });
                if (previous_values["previous_activity_stage"] !== 0){
                    activity_stage_previous.val(previous_values["previous_activity_stage"]);
                }
                input_display_title.removeAttr("hidden");

            // Bloque full sin respuesta anterior
            } else {
                input_activity_name_previous.setAttribute("hidden", true);
                input_activity_stage_previous.setAttribute("hidden", true);
                input_display_title.setAttribute("hidden", true);
            }

        // Bloque display
        } else {
            var selected = false;
            input_activity_name_previous.removeAttr("hidden");
            activity_name_previous.empty();
            for (let activity of activities) {
                let opt = document.createElement("option");
                opt.value = activity[1];
                opt.text = activity[1];
                if (previous_values["previous_activity_name"] == activity[1]){
                    opt.setAttribute("selected", true);
                    selected = true;
                }
                activity_name_previous.append(opt);
            }
            let opt0 = document.createElement("option");
            opt0.value = "none";
            opt0.text = "Por favor seleccione una opción...";
            opt0.setAttribute("disabled", true);
            if (!selected){
                opt0.setAttribute("selected", true);
            }
            activity_name_previous.append(opt0);
            activity_name_previous.on("change", function () {
                activity_stage_previous.empty();
                for (let activity of activities) {
                    if (activity[1] === activity_name_previous.val()) {
                        stages = activity[2].split(",");
                        for(let stage of stages){
                            let opt = document.createElement('option');
                            opt.value = stage;
                            opt.text = stage;
                            activity_stage_previous.append(opt);
                        }
                        if( activity_stage_previous.has('option').length > 0 ){
                            let opt0 = document.createElement("option");
                            opt0.value = "none";
                            opt0.text = "Por favor seleccione una opción...";
                            opt0.setAttribute("disabled", true);
                            opt0.setAttribute("selected", true);
                            activity_stage_previous.append(opt0);
                            input_activity_stage_previous.removeAttr("hidden");
                        } else {
                            activity_stage_previous.empty();
                        }
                    }
                }
            });
            if (previous_values["previous_activity_stage"] !== 0){
                activity_stage_previous.val(previous_values["previous_activity_stage"]);
            }
            input_display_title.removeAttr("hidden");
        }


    }


    $(element).find('.save-button').bind('click', function (eventObject) {
        eventObject.preventDefault();
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');

        if (block_type.val() === null){
            var data = {
                title: title.val(),
                block_type: null
            };
        } else if (block_type.val() === "full"){
            var data = {
                title: title.val(),
                activity_name: (activity_name.val() === "new" ? new_activity_name.val() : (activity_name.val() === null ? "" : activity_name.val())),
                block_type: block_type.val(),
                activity_stage: activity_stage.val(),
                stage_label: stage_label.val(),
                question: question.val(),
                activity_previous: activity_previous.val(),
                activity_name_previous: activity_name_previous.val(),
                activity_stage_previous: activity_stage_previous.val(),
                display_title: display_title.val()
            };
        } else if (block_type.val() === "display"){
            var data = {
                title: title.val(),
                block_type: block_type.val(),
                activity_name_previous: activity_name_previous.val(),
                activity_stage_previous: activity_stage_previous.val(),
                display_title: display_title.val()
            };
        } else if (block_type.val() === "summary"){
            var data = {
                title: title.val(),
                activity_name: activity_name.val(),
                block_type: block_type.val(),
                summary_text: summary_text.val()
            };
        }

        var error_msg = validate(data);
        if (error_msg !== "") {
            showMessage(error_msg);
        } else {
            console.log(data);
            if ($.isFunction(runtime.notify)) {
                runtime.notify('save', { state: 'start' });
            }
            $.post(handlerUrl, JSON.stringify(data)).done(function (response) {
                console.log(response)
                if ($.isFunction(runtime.notify)) {
                    runtime.notify('save', { state: 'end' });
                }
            });
        }
    });

    $(element).find('.cancel-button').bind('click', function (eventObject) {
        eventObject.preventDefault();
        runtime.notify('cancel', {});
    });

    function onLoad() {

        // XBlock is being created for the first time
        if (context["block_type"] === "none") {

            input_title.removeAttr("hidden");
            title.val("Iterative Assessed Activity")
            input_block_type.removeAttr("hidden");
            input_block_type.removeAttr("disabled");
            let block_type_options = [["full", "Completo"], ["display", "Sólo respuesta anterior"], ["summary", "Resumen"], ["none", "Por favor seleccione una opción..."]];
            for (let option of block_type_options) {
                let opt = document.createElement("option");
                opt.value = option[0];
                opt.text = option[1];
                block_type.append(opt);
                if (option[0] === "none") {
                    opt.setAttribute("disabled", true);
                    opt.setAttribute("selected", true);
                }
                if((option[0] === "display" || option[0] === "summary") && activities.length === 0){
                    opt.setAttribute("disabled", true);
                }
            }

            block_type.on("change", function () {

                // All inputs are hidden
                input_activity_name.attr("hidden", true);
                activity_name.empty();
                input_new_activity_name.attr("hidden", true);
                input_activity_stage.attr("hidden", true);
                input_stage_label.attr("hidden", true);
                input_activity_name_previous.attr("hidden", true);
                input_activity_stage_previous.attr("hidden", true);
                input_display_title.attr("hidden", true);
                input_question.attr("hidden", true);
                input_summary_text.attr("hidden", true);

                // Load activity_name input
                if (block_type.val() !== "display") {
                    input_activity_name.removeAttr("hidden");
                    activity_name.removeAttr("disabled");
                    for (let activity of activities) {
                        if (!activity[2] === ALL_STAGES){
                            let opt = document.createElement("option");
                            opt.value = activity[1];
                            opt.text = activity[1];
                            activity_name.append(opt);
                        }
                    }
                    if (block_type.val() === "full") {
                        let opt00 = document.createElement("option");
                        opt00.value = "new";
                        opt00.text = "Crear nueva actividad...";
                        activity_name.append(opt00);
                    }
                    let opt0 = document.createElement("option");
                    opt0.value = "none";
                    opt0.text = "Por favor seleccione una opción...";
                    opt0.setAttribute("disabled", true);
                    opt0.setAttribute("selected", true);
                    activity_name.append(opt0);
                }

                // After an activity is chosen, the rest of the inputs are shown
                activity_name.on("change", function () {
                    // The new activity name input is shown if a new activity is going to be created
                    if (activity_name.val() == "new") {
                        input_new_activity_name.removeAttr("hidden");
                    } else {
                        input_new_activity_name.attr("hidden", true)
                    }

                    if (block_type.val() === "full") {

                        // The activity stage is set
                        input_activity_stage.removeAttr("hidden");
                        activity_stage.empty();
                        if (activity_name.val() === "new") {
                            activity_stage.attr("disabled", true);
                            let opt = document.createElement('option');
                            opt.value = "1"
                            opt.text = "1"
                            opt.setAttribute("selected", true);
                            activity_stage.append(opt);
                        } else {  
                            activity_stage.removeAttr("disabled");
                            for (let activity of activities) {
                                if (activity[1] === activity_name.val()) {
                                    stages = activity[2].split(',');
                                    //if (stages === allStages)
                                    console.log(stages);
                                    for(let i = 1; i <= MAX_STAGES; i++){
                                        if(!stages.includes(i.toString())){
                                            let opt = document.createElement('option');
                                            opt.value = i.toString();
                                            opt.text = i.toString();
                                            activity_stage.append(opt);
                                        }
                                    }
                                }
                            }
                            let opt0 = document.createElement("option");
                            opt0.value = "none";
                            opt0.text = "Por favor seleccione una opción...";
                            opt0.setAttribute("disabled", true);
                            opt0.setAttribute("selected", true);
                            activity_stage.append(opt0);
                        }
                        input_stage_label.removeAttr("hidden");
                        input_question.removeAttr("hidden");
                        
                        input_activity_previous.removeAttr("hidden");
                        activity_previous.on("change", () => handlePrevious({show: true}));
                        activity_stage.on("change", function(){
                            activity_previous.val("no");
                        });
                    }

                    if (block_type.val() === "summary") {
                        input_summary_text.removeAttr("hidden");
                    }
                });

                if (block_type.val() === "display") {
                    handlePrevious({
                        show: false,
                        previous_activity_name: "",
                        previous_activity_stage: 0
                    });
                }

            });


        // XBlock is being edited
        } else {
            input_title.removeAttr("hidden");
            title.val(context["title"])
            input_block_type.removeAttr("hidden");
            let opt = document.createElement("option");
            opt.value = context["block_type"]
            opt.text = (context["block_type"] === "full" ? "Completo" : (context["block_type"] === "display" ? "Solo respuesta anterior" : "Resumen"))
            opt.setAttribute("selected", true)
            block_type.append(opt);
            block_type.attr("disabled", true);
            // seleccionar todo
            if (block_type.val() === "full") {
                input_activity_name.removeAttr("hidden");

                activity_name.empty()
                let opt = document.createElement('option');
                opt.value = context["activity_name"]
                opt.text = context["activity_name"]
                opt.setAttribute("selected", true);
                activity_name.append(opt);
                activity_name.val(context["activity_name"]).change();
                activity_name.attr("disabled", true);
                input_activity_stage.removeAttr("hidden");

                activity_stage.empty();
                console.log(activities)
                console.log(activity_name.val())
                for (let activity of activities) {
                    if (activity[1] === activity_name.val()) {
                        stages = activity[2].split(',');
                        for(let i = 1; i <= MAX_STAGES; i++){
                            if (i === parseInt(context["activity_stage"])){
                                let opt = document.createElement('option');
                                opt.value = i.toString();
                                opt.text = i.toString();
                                opt.setAttribute("selected", true);
                                activity_stage.append(opt);
                            }
                            if(!stages.includes(i.toString())){
                                let opt = document.createElement('option');
                                opt.value = i.toString();
                                opt.text = i.toString();
                                activity_stage.append(opt);
                            }
                        }
                    }
                }
                input_stage_label.removeAttr("hidden");
                stage_label.val(context["stage_label"]);
                input_question.removeAttr("hidden");
                question.val(context["question"]);
            } else if (block_type.val() === "summary") {
                input_activity_name.removeAttr("hidden");
                activity_name.val(context["activity_name"]).change();
                activity_name.attr("disabled", true);
                input_summary_text.removeAttr("hidden");
                summary_text.val(context["summary_text"])
            }
            if (block_type.val() !== "summary") {
                if (block_type.val() === "full"){
                    input_activity_previous.removeAttr("hidden");
                    activity_previous.on("change", () => handlePrevious({
                        show: true,
                        previous_activity_name: context["activity_name_previous"],
                        previous_activity_stage: context["activity_stage_previous"]
                    }));
                    activity_stage.on("change", function(){
                        activity_name_previous.val("none");
                        activity_stage_previous.val("no");
                    });
                } else {
                    activity_previous.on("change", () => handlePrevious({
                        show: false,
                        previous_activity_name: context["activity_name_previous"],
                        previous_activity_stage: context["activity_stage_previous"]
                    }));
                    activity_stage.on("change", function(){
                        activity_name_previous.val("none");
                    });
                }
            }
        }
    }
    onLoad();

}