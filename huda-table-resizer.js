var TableResizer = {
    DRAG: false,
    createTable: function(divId, colNum, rowNum)
    {
        var tbl = document.createElement("table");
        $(tbl).attr("id", divId + "-table");
        $(tbl).addClass("tbl-pdf");

        var tr = document.createElement("tr");
        $(tr).attr("row-idx", -1);

        for(var i = 0; i < colNum; i++)
        {
            var th = document.createElement("th");
            $(th).attr("col-idx",  i);
            $(th).attr("row-idx",  -1);
            $(tr).append(th);
        }
        $(tbl).append(tr);

        for(var i = 0; i < rowNum; i++)
        {
            var tr = document.createElement("tr");
            $(tr).attr("row-idx" , i);
            for(var j = 0; j < colNum; j++)
            {
                var td = document.createElement("td");
                $(td).attr("row-idx",  i);
                $(td).attr("col-idx",  j);
                $(tr).append(td);
            }
            $(tbl).append(tr);
        }

        return tbl;
    }
    ,
    setAllIdx: function(tbl)
    {
        let prevIdx = -1;
        var rowIdx = -1;
        var colIdx = 0;
        $(tbl).find("tr").each(function(rowindex) {
    
            if(rowindex == 0)
            {
                $(this).attr("row-idx", rowIdx);
            }
            colIdx = 0;
            $(this).find("th").each(function(tdindex){    
                $(this).attr("row-idx", rowIdx);
                $(this).attr("col-idx", colIdx);
                colIdx++;
            })
        });

        rowIdx = 0;
        $(tbl).find("tr").each(function(rowindex) {
    
            if(rowindex > 0)
            {
                $(this).attr("row-idx", rowIdx - 1);
            }
            colIdx = 0;
            $(this).find("td").each(function(tdindex){    
                $(this).attr("row-idx", rowIdx);
                $(this).attr("col-idx", colIdx);
                colIdx++;
            })
            rowIdx++;
        });
    
    }
    ,
    addCol: function(tbl, idx)
    {
        //Create new TH
        var th = document.createElement("th");
        $(th).attr("col-idx",  parseInt(idx) +1);
        $(th).attr("row-idx",  -1);
        $(th).append(TableResizer.getThContent());

        //Insert new TH into header
        $(tbl).find("th[col-idx=" + idx + "]").after(th);
    
    
        //Create new TD 
        var td = document.createElement("td");
        $(td).append(TableResizer.getTdContent());
        $(td).attr("col-idx",  parseInt(idx)+1);

        //Insert new TD into rows
        $(tbl).find("td[col-idx=" + idx + "]").after(td);
    
        //Set all indexes
        TableResizer.setAllIdx(tbl);

        TableResizer.setLastTdContent(tbl);
        TableResizer.initTableEvents(tbl);
        
    }
    ,
    delCol: function(tbl, idx)
    {
        $(tbl).find("[col-idx=" + idx + "]").remove();
        TableResizer.setAllIdx(tbl)
        TableResizer.setLastTdContent(tbl);
        TableResizer.initTableEvents(tbl);
    }
    ,
    addRow: function(tbl, idx)
    {
        //Create new TR with initialized TDs
        var tr = document.createElement("tr");
        let totalCols = $(tbl).find("th").length;
        for(var i = 0; i < totalCols; i++)
        {
            var td = document.createElement("td");
            $(td).append(TableResizer.getTdContent());
            $(tr).append(td);
        }
    
        //Insert into table
        if(idx == -1)
            $(tbl).find("tr[row-idx=-1]").after(tr);
        else
            $(tbl).find("tr[row-idx=" + idx + "]").after(tr);
    

        //Set all indexes
        TableResizer.setAllIdx(tbl);
        
        TableResizer.setLastTdContent(tbl);
        TableResizer.initTableEvents(tbl);
        
    }
    ,
    delRow: function(tbl, idx)
    {
        if(idx == -1)
            $(tbl).find("tr[row-idx=-1]").remove();
        else
            $(tbl).find("tr[row-idx=" + idx + "]").remove();
    
        //Set all indexes
        TableResizer.setAllIdx(tbl);

        TableResizer.setLastTdContent(tbl);
        TableResizer.initTableEvents(tbl);
        
    }
    ,
    getThContent: function()
    {
        let btnAdd = "<div class=\"coladd\"></div> ";
        let btnDel = "<div class=\"coldel\"></div> ";
        let divBtn = "<div class='coladddel-container'>" + btnAdd + btnDel + "</div>";
    
        let thContent = divBtn +
                        "<div class='th-dragger-container'> " +
                            "<div class='dragger-column-container'> " +
                                "<div class=\"dragger-column\"></div> " +
                            "</div> " +
                            "<div class='dragger-row-container'> " +
                                "<div class=\"dragger-row\"></div> " +
                            "</div> " +
                        "</div>";
    
        return thContent;
    }
    ,
    getThLastContent: function()
    {
        
        let btnRowAdd = "<div class=\"rowadd\"></div> ";
        let btnRowDel = "<div class=\"rowdel\"></div> ";
        let divbtnRow = "<div class='rowadddel-container'>" + btnRowAdd + "</div>"
    
        let btnAdd = "<div class=\"coladd\"></div> ";
        let btnDel = "<div class=\"coldel\"></div> ";
        let divBtnCol = "<div class='coladddel-container'>" + btnAdd + btnDel + "</div>";
    
        let thDragger = "<div class='th-dragger-container'> " +
                            "<div class='dragger-column-container'> " +
                                "<div class=\"dragger-column\"></div> " +
                            "</div> " +
                            "<div class='dragger-row-container'> " +
                                "<div class=\"dragger-row\"></div> " +
                            "</div> " +
                        "</div>";
        let thContent = "<div class='th-last'><div class='th-last-button-dragger'>" + divBtnCol + thDragger + "</div>" + divbtnRow + "</div>"
                            
        return thContent;
    }
    ,
    getTdContent: function()
    {
        let thDragger = "<div class='th-dragger-container'> " +
                            "<div class='dragger-column-container'> " +
                                "<div class=\"dragger-column\"></div> " +
                            "</div> " +
                            "<div class='dragger-row-container'> " +
                                "<div class=\"dragger-row\"></div> " +
                            "</div> " +
                        "</div>";
    
        return thDragger;
    }
    ,
    setLastTdContent: function(tbl)
    {
        let totalCols = $(tbl).find("th").length;
    
        $(tbl).find("div[class=rowadd]").remove();
        $(tbl).find("tr").each(function(rowIdx){
            let td = null;
            let iii = 0;
            $(this).find("td").each( function(colIdx){
    
                if(colIdx == totalCols - 1)
                    td = $(this);
    
            })
            if($(td).find("[class='rowadd'").length == 0)
            {
                let tdContent = $(td).html();
                
                let btnRowAdd = "<div class=\"rowadd\"></div> ";
                let btnRowDel = "<div class=\"rowdel\"></div> ";
                let divbtnRow = "<div class='rowadddel-container'>" + btnRowAdd + btnRowDel + "</div>"            
                let newTdContent = "<div class='th-last'><div class='th-last-button-dragger'>" + tdContent + "</div>" + divbtnRow + "</div>"
    
                $(td).html(newTdContent)
            }
        })
    
        var td = null;
        $(tbl).find("th").each(function(){
            td = $(this);
        })
    
        $(td).html(TableResizer.getThLastContent());
    
    }
    ,
    initTableEvents: function(tbl)
    {
        var pressedcol = false;
        var pressedrow = false;
        var start = undefined;
        var startX, startWidth;
        var startY, startHeight;
    
        var tblId = tbl.id;
        var divId = $(tbl).parent().attr("id");
    
        $("#" + tblId + " .dragger-column").off("mousedown");
        $("#" + tblId + " .dragger-column").mousedown(function(e) {
            if(TableResizer.DRAG == false)
            {
                var tagname = "th";
                if($(this).parents("th").length > 0)
                    tagname = "th";
                else
                    tagname = "td";
                
                start = $(this).parents(tagname);
    
                console.log(start)
                pressedcol = true;
                startX = e.pageX;
                startWidth = $(this).parents(tagname).css("width");
                startHeight = $(this).parents(tagname).css("height");
                $(start).addClass("resizing");
            }
        });
    
        $("#" + tblId + " .dragger-row").off("mousedown");
        $("#" + tblId + " .dragger-row").mousedown(function(e) {
            if(TableResizer.DRAG == false)
            {
                var tagname = "th";
                if($(this).parents("th").length > 0)
                    tagname = "th";
                else
                    tagname = "td";
    
                start = $(this).parents(tagname);
    
                console.log(start[0])
                pressedrow = true;
                startY = e.pageY;
                startWidth = $(this).parents(tagname).css("width");
                startHeight = $(this).parents(tagname).css("height");
                console.log("startHeight")
                console.log(startHeight)
                $(start).addClass("resizing");
            }
        });

        $(document).mousemove(function(e) {
            
            if(pressedcol) {
                let ww  = parseFloat( startWidth)+(e.pageX-startX);
                $(start).width(ww);
            }
            if(pressedrow) {
                let hh  = parseFloat( startHeight)+(e.pageY-startY);
                $(start).height(hh);
            }
        });
        
        $(document).mouseup(function() {
            if(pressedcol) {
                $(start).removeClass("resizing");
                pressedcol = false;
            }
            if(pressedrow) {
                $(start).removeClass("resizing");
                pressedrow = false;
            }
        });
    
    
        $("#drag").off("mousedown");
        $("#drag").on("mousedown", function()
        {
            $("#" + divId).draggable();
        })
    
        $("#drag").off("mouseup");
        $("#drag").on("mouseup", function()
        {
            $("#" + divId).draggable('destroy');
        })
    
        $("#drag").off("mouseover");
        $("#drag").on("mouseover", function()
        {
            $("#drag").css("opacity", "1");
        })
    
        $("#drag").off("mouseout");
        $("#drag").on("mouseout", function()
        {
            $("#drag").css("opacity", ".2");
        })
    
        $(".coladd").off("click");
        $(".coladd").on("click", function(){
            var th = $(this).parents("th");
            var idx = $(th).attr("col-idx");
            TableResizer.addCol(tbl, idx)
        });

        $(".coldel").off("click");
        $(".coldel").on("click", function(){
            var th = $(this).parents("th");
            var idx = $(th).attr("col-idx");
            TableResizer.delCol(tbl, idx)
        });
    
        $(".rowadd").off("click");
        $(".rowadd").on("click", function(){
            var th = $(this).parents("tr");
            var idx = $(th).attr("row-idx");
            
            TableResizer.addRow(tbl, idx)
        });
    
        $(".rowdel").off("click");
        $(".rowdel").on("click", function(){
            var th = $(this).parents("tr");
            var idx = $(th).attr("row-idx");
            
            TableResizer.delRow(tbl, idx)
        });
    


        TableResizer.draginit();
        
    }
    ,
    createResizedTable: function(divId, colNum, rowNum)
    {
        var pressedcol = false;
        var pressedrow = false;
        var start = undefined;
        var startX, startWidth;
        var startY, startHeight;
    
        var tbl = TableResizer.createTable(divId, colNum, rowNum);
        var tblId = tbl.id;
        var moverDiv = "<div id=\"drag\"></div>";
    
        $("#" + divId).attr("style", "padding: 10px;position: absolute; top: 40%; left:10%");
        $("#" + divId).append(moverDiv);
        $("#" + divId).append(tbl);
    
        $("#" + tblId + " th").html(TableResizer.getThContent())
        $("#" + tblId + " td").html(TableResizer.getTdContent())
        
        TableResizer.setLastTdContent(tbl);
        TableResizer.initTableEvents(tbl);
    
    }
    ,
    createResizedTableByInfo: function(divId, info)
    {
        console.log("createResizedTableByInfo");
        console.log(info);
        TableResizer.createResizedTable(divId, info.totalColumn, info.totalRows);
    
        var table = $("#" + divId).find("table")[0];
    
        $("#" + divId).css("left", info.containerPosX);
        $("#" + divId).css("top", info.containerPosY);
    
        
    
        $(table).find("th").each(function(idx){
            $(this).css("width", info.headers[idx].width);
            $(this).css("height", info.headers[idx].height);
        });
    
        $(table).find("tr[row-idx]").each(function(rowIdx){
            
            let rowid = $(this).attr("row-idx");
            console.log("row " +  rowid)
            if(rowid > -1)
            {
                $(this).find("td").each(function(colIdx){
                    $(this).css("height", info.rows[rowid][colIdx].height);
                })
            }
    
    
        });
    
        TableResizer.setLastTdContent(table);
        TableResizer.initTableEvents(table);
    
    }
    ,
    draginit: function()
    {
    
        $("#drag").css("margin-left", "-20px");
        $("#drag").css("opacity", ".2");
        $("#drag").css("cursor", "pointer");
    }
    ,
    getTableInformation: function(divId)
    {
        var table = $("#" + divId).find("table")[0];
    
        var info = {};
        info.posY = $(table).offset().top;
        info.posX = $(table).offset().left;
        info.containerPosY = $("#" + divId).offset().top;
        info.containerPosX = $("#" + divId).offset().left;
        info.width = $(table).css("width");
        info.width = $(table).css("height");
        info.totalColumn = $(table).find("th").length;
        info.totalRows = $(table).find("tr").length - 1;
    
        info.headers = [];
        info.rows = [];
        $(table).find("th").each(function(){
            let headcell = {};
            headcell.width = $(this).css("width");
            headcell.height = $(this).css("height");
            info.headers.push(headcell);
        });
    
        let rowIdx = -1;
        $(table).find("tr").each(function(){
    
            if(rowIdx >= 0)
            {
                let row = [];
                $(this).find("td").each(function(){
                    let cell = {};
                    cell.width = $(this).css("width");
                    cell.height = $(this).css("height");
                    row.push(cell);
                });
    
                info.rows.push(row);
            }
    
            rowIdx++;
    
        });
    
        return info;
    }
    

}