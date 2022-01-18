$(document).ready(function () {
        $('#content').liveEdit({
            css: ['bootstrap/css/bootstrap.min.css', 'bootstrap/bootstrap_extend.css'] /* Apply bootstrap css into the editing area */,
            groups: [
                    ["group1", "", ["Bold", "Italic", "Underline", "ForeColor", "RemoveFormat"]],
                    ["group2", "", ["Bullets", "Numbering", "Indent", "Outdent"]],
                    ["group3", "", ["Paragraph", "FontSize", "FontDialog", "TextDialog"]],
                    ["group4", "", ["LinkDialog", "ImageDialog", "TableDialog", "Emoticons", "Snippets"]],
                    ["group5", "", ["Undo", "Redo", "FullScreen", "SourceDialog"]]
                    ] /* Toolbar configuration */
        });

        $('#content2').liveEdit({
            css: ['bootstrap/css/bootstrap.min.css', 'bootstrap/bootstrap_extend.css'] /* Apply bootstrap css into the editing area */,
            groups: [
                    ["group1", "", ["Bold", "Italic", "Underline", "ForeColor", "RemoveFormat"]],
                    ["group2", "", ["Bullets", "Numbering", "Indent", "Outdent"]],
                    ["group3", "", ["Paragraph", "FontSize", "FontDialog", "TextDialog"]],
                    ["group4", "", ["LinkDialog", "ImageDialog", "TableDialog", "Emoticons"]],
                    ["group5", "", ["Undo", "Redo", "FullScreen", "SourceDialog"]]
                    ] /* Toolbar configuration */
        });
    });

    function edit() {
        SaveAndCloseAllEditors()

        $('#content').data('liveEdit').startedit();
        
        $('#btnEdit').css('display', 'none');
        $('#btnSave').css('display', 'inline');
        
    }

    function edit2() {

        SaveAndCloseAllEditors()

        $('#content2').data('liveEdit').startedit();

        $('#btnEdit2').css('display', 'none');
        $('#btnSave2').css('display', 'inline');
        
    }

    function SaveAndCloseAllEditors() {

        var activer_editor_id = $('#content').data('liveEdit').getActiveEditorId()
        if (!activer_editor_id) return;

        var sHtml = $('#' + activer_editor_id).data('liveEdit').getXHTMLBody(); //Use before finishedit()
        $('#' + activer_editor_id).data('liveEdit').finishedit();

        $('#btnEdit').css('display', 'inline');
        $('#btnSave').css('display', 'none');

        $('#btnEdit2').css('display', 'inline');
        $('#btnSave2').css('display', 'none');

        EmbedFont();

    };


    $("#show").click(function(){
        var sHtml = $('#' + activer_editor_id).data('liveEdit').getXHTMLBody();
        alert(sHtml);
    });






