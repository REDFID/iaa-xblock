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
                if (data["activity_name"] === context["activity_name"]){
                    return "El nombre es igual a la actividad actual."
                }
                for (let activity of activities){
                    if (data["activity_name"] === activity["activity_name"]){
                        return "Ya existe en este curso una actividad con ese nombre."
                    }
                }
                if (data["activity_name"] === "new" || data["activity_name"] === "TestActivity"){
                    return "Los nombres de actividad 'new' y 'TestActivity' son inválidos."
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
                    return "Respuesta anterior inválida."
                }
                if (data["display_title"] === ""){
                    return "Por favor proporcione un título a la respuesta anterior."
                }
            }
        } else if (data["block_type"] === "display"){
            if (data["activity_name_previous"] === "none" || data["activity_name_previous"] == null){
                return "Por favor indique el nombre de la actividad de la cual se mostrará una respuesta anterior."
            }
            if (data["activity_stage_previous"] === "none" || data["activity_stage_previous"] == null){
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
                activity_previous.val("no").change();
                input_activity_previous.attr("hidden", true);

                // Load activity_name input
                if (block_type.val() !== "display") {
                    input_activity_name.removeAttr("hidden");
                    activity_name.removeAttr("disabled");
                    for (let activity of activities) {
                        if (activity[2] !== ALL_STAGES){
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
                    opt0.setAttribute("selected", true);
                    opt0.setAttribute("disabled", true);
                    activity_name.append(opt0);
                }

                // After an activity is chosen, the rest of the inputs are shown
                activity_name.on("change", function () {
                    // The new activity name input is shown if a new activity is going to be created
                    if (activity_name.val() == "new") {
                        input_new_activity_name.removeAttr("hidden");
                    } else {
                        input_new_activity_name.attr("hidden", true);
                    }

                    if (block_type.val() === "full") {

                        // The activity stage is set
                        input_activity_stage.removeAttr("hidden");
                        activity_stage.empty();
                        if (activity_name.val() === "new") {
                            activity_stage.attr("disabled", true);
                            let opt = document.createElement('option');
                            opt.value = "1";
                            opt.text = "1";
                            opt.setAttribute("selected", true);
                            activity_stage.append(opt);
                        } else {  
                            activity_stage.removeAttr("disabled");
                            for (let activity of activities) {
                                if (activity[1] === activity_name.val()) {
                                    stages = activity[2].split(',');
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
                    
                        activity_previous.on("change", function (){
                            activity_name_previous.empty();
                            if (activity_previous.val() === "yes"){
                                input_activity_name_previous.removeAttr("hidden");
                                input_activity_stage_previous.removeAttr("hidden");
                                input_display_title.removeAttr("hidden");
                                for (let activity of activities) {
                                    let opt = document.createElement("option");
                                    opt.value = activity[1];
                                    opt.text = activity[1];
                                    if (context["activity_name_previous"] == activity[1]){
                                        activity_exists = true;
                                    }
                                    activity_name_previous.append(opt);
                                }
                                let opt0 = document.createElement("option");
                                opt0.value = "none";
                                opt0.text = "Por favor seleccione una opción...";
                                opt0.setAttribute("disabled", true);
                                activity_name_previous.append(opt0);

                                activity_name_previous.on("change", function() {
                                    activity_stage_previous.empty();
                                    for (let activity of activities) {
                                        if (activity[1] === activity_name_previous.val()) {
                                            stages = activity[2].split(",");
                                            for(let stage of stages){
                                                if (activity_name.val() !== activity_name_previous.val() || activity_stage.val() !== stage){
                                                    let opt = document.createElement('option');
                                                    opt.value = stage;
                                                    opt.text = stage;
                                                    activity_stage_previous.append(opt);
                                                }
                                            }
                                            let opt0 = document.createElement("option");
                                            opt0.value = "none";
                                            opt0.text = "Por favor seleccione una opción...";
                                            opt0.setAttribute("disabled", true);
                                            activity_stage_previous.append(opt0);
                                            input_activity_stage_previous.removeAttr("hidden");
                                        }
                                    }
                                });

                                if (context["activity_name_previous"] !== ""){
                                    activity_name_previous.val(context["activity_name_previous"]).change();
                                    let opts = document.getElementById('yourselect').options;
                                    var option_exists = false;
                                    for (let opt of opts){
                                        if (opt.value === context["activity_name_previous"]){
                                            activity_stage_previous.val(context["activity_name_previous"]).change();
                                            option_exists = true;
                                            break;
                                        }
                                    }
                                    if (!option_exists) {
                                        activity_stage_previous.val("none").change();
                                    }
                                } else {
                                    activity_name_previous.val("none").change();
                                }

                            } else {
                                input_activity_name_previous.attr("hidden", true);
                                input_activity_stage_previous.attr("hidden", true);
                                input_display_title.attr("hidden", true);
                            }
                        });
                        activity_previous.val("no").change();
                        activity_stage.on("change", function() {
                            if (activity_previous.val() === "yes"){
                                activity_name_previous.val("none").change();
                            }
                        });
                        activity_name.on("change", function() {
                            if (activity_previous.val() === "yes"){
                                activity_name_previous.val("none").change();
                            }
                        }); 
                    }
                    if (block_type.val() === "summary") {
                        input_summary_text.removeAttr("hidden");
                    }
                });

                if (block_type.val() === "display") {
                    input_display_title.removeAttr("hidden");
                    input_activity_name_previous.removeAttr("hidden");
                    activity_name_previous.empty();
                    for (let activity of activities) {
                        let opt = document.createElement("option");
                        opt.value = activity[1];
                        opt.text = activity[1];
                        activity_name_previous.append(opt);
                    }
                    let opt0 = document.createElement("option");
                    opt0.value = "none";
                    opt0.text = "Por favor seleccione una opción...";
                    opt0.setAttribute("disabled", true);
                    activity_name_previous.append(opt0);
                    activity_name_previous.on("change", function() {
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
                                let opt0 = document.createElement("option");
                                opt0.value = "none";
                                opt0.text = "Por favor seleccione una opción...";
                                opt0.setAttribute("disabled", true);
                                opt0.setAttribute("selected", true);
                                activity_stage_previous.append(opt0);
                                input_activity_stage_previous.removeAttr("hidden");
                            }
                        }
                    });
                    activity_name_previous.val("none").change();
                }

            });


        // XBlock is being edited
        } else {
            input_title.removeAttr("hidden");
            title.val(context["title"])
            input_block_type.removeAttr("hidden");
            block_type.empty();
            let opt000 = document.createElement("option");
            opt000.value = context["block_type"]
            opt000.text = (context["block_type"] === "full" ? "Completo" : (context["block_type"] === "display" ? "Solo respuesta anterior" : "Resumen"))
            block_type.append(opt000);
            block_type.val(context["block_type"]).change();
            // seleccionar todo
            if (block_type.val() === "full") {
                input_activity_name.removeAttr("hidden");
                input_activity_stage.removeAttr("hidden");

                activity_name.empty();
                activity_stage.empty();

                activity_name.on("change", function() {
                    activity_stage.empty();
                    
                    if (activity_name.val() == "new") {
                        input_new_activity_name.removeAttr("hidden");
                        let opt = document.createElement('option');
                        opt.value = "1";
                        opt.text = "1";
                        opt.setAttribute("selected", true);
                        activity_stage.append(opt);
                    } else {
                        input_new_activity_name.attr("hidden", true);
                        var current_activity;
                        for (let activity of activities){
                            if (activity[1] === activity_name.val()){
                                current_activity = activity;
                            }
                        }
                        stages = current_activity[2].split(',');
                        var selected_stage = false;
                        for(let i = 1; i <= MAX_STAGES; i++){
                            let opt = document.createElement('option');
                            opt.value = i.toString();
                            opt.text = i.toString();
                            if (!selected_stage){
                                opt.setAttribute("selected", true);
                            }
                            selected_stage = true;
                            activity_stage.append(opt);
                        }
                    }
                })
                for (let activity of activities) {
                    let opt = document.createElement('option');
                    opt.value = activity[1];
                    opt.text = activity[1];
                    activity_name.append(opt);
                }
                let opt00 = document.createElement("option");
                opt00.value = "new";
                opt00.text = "Crear nueva actividad...";
                activity_name.append(opt00);
                activity_name.val(context["activity_name"]).change();
                activity_stage.val(context["activity_stage"]).change();
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
                    var activity_exists;
                    var stage_exists;
                    for (let activity of activities){
                        if (activity[1] === context["activity_name_previous"]){
                            activity_exists = true;
                            for (let stage of activity[2].split(",")){
                                if (stage === context["activity_stage_previous"]){
                                    stage_exists = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    activity_previous.on("change", function (){
                        activity_name_previous.empty();
                        if (activity_previous.val() === "yes"){
                            input_activity_name_previous.removeAttr("hidden");
                            input_activity_stage_previous.removeAttr("hidden");
                            input_display_title.removeAttr("hidden");
                            for (let activity of activities) {
                                let opt = document.createElement("option");
                                opt.value = activity[1];
                                opt.text = activity[1];
                                if (context["activity_name_previous"] == activity[1]){
                                    activity_exists = true;
                                }
                                activity_name_previous.append(opt);
                            }
                            let opt0 = document.createElement("option");
                            opt0.value = "none";
                            opt0.text = "Por favor seleccione una opción...";
                            opt0.setAttribute("disabled", true);
                            activity_name_previous.append(opt0);
                        
                            activity_name_previous.on("change", function() {
                                activity_stage_previous.empty();
                                for (let activity of activities) {
                                    if (activity[1] === activity_name_previous.val()) {
                                        stages = activity[2].split(",");
                                        for(let stage of stages){
                                            if (activity_name.val() !== activity_name_previous.val() || activity_stage.val() !== stage){
                                                let opt = document.createElement('option');
                                                opt.value = stage;
                                                opt.text = stage;
                                                activity_stage_previous.append(opt);
                                            }
                                        }
                                        let opt0 = document.createElement("option");
                                        opt0.value = "none";
                                        opt0.text = "Por favor seleccione una opción...";
                                        opt0.setAttribute("disabled", true);
                                        activity_stage_previous.append(opt0);
                                        input_activity_stage_previous.removeAttr("hidden");
                                    }
                                }
                            });

                            if (context["activity_name_previous"] !== ""){
                                activity_name_previous.val(context["activity_name_previous"]).change();
                                let opts = document.getElementById('activity_stage_previous').options;
                                var option_exists = false;
                                for (let opt of opts){
                                    if (opt.value === context["activity_stage_previous"]){
                                        activity_stage_previous.val(context["activity_stage_previous"]).change();
                                        option_exists = true;
                                        break;
                                    }
                                }
                                if (!option_exists) {
                                    activity_stage_previous.val("none").change();
                                }
                            } else {
                                activity_name_previous.val("none").change();
                            }

                        } else {
                            input_activity_name_previous.attr("hidden", true);
                            input_activity_stage_previous.attr("hidden", true);
                            input_display_title.attr("hidden", true);
                        }
                    });
                    activity_previous.val(context["activity_name_previous"] !== "" ? "yes" : "no").change();
                    if (activity_previous.val() === "yes"){
                        display_title.val(context["display_title"])
                        if(!activity_exists){
                            activity_name_previous.val("none").change();
                        } else {
                            activity_name_previous.val(context["activity_name_previous"]).change();

                            if (!stage_exists){
                                activity_stage_previous.val("none").change();
                            } else {
                                activity_stage_previous.val(context["activity_stage_previous"]).change();
                            }
                        }
                    }
                    activity_stage.on("change", function() {
                        if (activity_previous.val() === "yes"){
                            activity_name_previous.val("none").change();
                        }
                    });
                    activity_name.on("change", function() {
                        if (activity_previous.val() === "yes"){
                            activity_name_previous.val("none").change();
                        }
                    });
                } else {
                    var activity_exists = false;
                    input_display_title.removeAttr("hidden");
                    display_title.val(context["display_title"]).change();
                    input_activity_name_previous.removeAttr("hidden");
                    activity_name_previous.empty();
                    for (let activity of activities) {
                        let opt = document.createElement("option");
                        opt.value = activity[1];
                        opt.text = activity[1];
                        if (context["activity_name_previous"] == activity[1]){
                            opt.setAttribute("selected", true);
                            activity_exists = true;
                        }
                        activity_name_previous.append(opt);
                    }
                    let opt0 = document.createElement("option");
                    opt0.value = "none";
                    opt0.text = "Por favor seleccione una opción...";
                    opt0.setAttribute("disabled", true);
                    activity_name_previous.append(opt0);
                    activity_name_previous.on("change", function() {
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
                                let opt0 = document.createElement("option");
                                opt0.value = "none";
                                opt0.text = "Por favor seleccione una opción...";
                                opt0.setAttribute("disabled", true);
                                opt0.setAttribute("selected", true);
                                activity_stage_previous.append(opt0);
                                input_activity_stage_previous.removeAttr("hidden");
                            }
                        }
                    });
                    if(!activity_exists){
                        // reset por borrado externo
                        // y si no hay ninguna? forzar a borrar xblock... como?
                        activity_name_previous.val("none").change();
                    } else {
                        activity_name_previous.val(context["activity_name_previous"]).change();
                        var stage_exists = false;
                        for (let stage_option of document.getElementById("activity_stage_previous").options){
                            if (stage_option.value === context["activity_stage_previous"]){
                                stage_exists = true;
                                activity_stage_previous.val(stage_option.value).change();
                                break;
                            }
                        }
                        if (!stage_exists){
                            activity_stage_previous.val("none").change()
                        }
                    }
                }
            }
        }
    }
    onLoad();
}