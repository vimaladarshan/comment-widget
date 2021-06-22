var count = 0;
var comments = [
  {
    "comment_id": 1,
    "content": "hello how are you?",
    "child": [
      {
        "comment_id": 5,
        "content": "Good, what about you?"
      }
    ]
  },
  {
    "comment_id": 2,
    "content": "happy birthday to you!!",
    "child": [
      {
        "comment_id": 3,
        "content": "Thank you!!",
        "child": [
          {
            "comment_id": 4,
            "content": "how about your family!!",
            "child": [
              {
                "comment_id": 6,
                "content": "Yeah great!!"
              }
            ]
          }
        ]
      }
    ]
  }
];
var editContent;

function addComment(){
    var commentBox = document.getElementById("comment").value;
    let commentId = comments.length+1;
    let commentObj = {
      "comment_id": commentId,
      "content": commentBox
    };
    comments.unshift(commentObj);
    loadComments();
}

function editComment(commentId){
  editContent = document.querySelector('#PcommentsPart'+commentId).textContent;
  document.querySelector('#PcommentsPart'+commentId).remove();
  let editInput = createElement('input',{
    "value": editContent,
    "class": ["InsideBoxCommentInput"],
    "id": "InsideBoxCommentInput"+commentId
  });
  document.querySelector('#commentsPart'+commentId).append(editInput);
  window.addEventListener('click', outerClickDetector);

  function outerClickDetector(e){
    if (document.getElementById('commentsView').contains(e.target) && editContent != undefined){
      console.log('in');
      return true;
    } 
    else{
      let updatedContent = document.getElementById('InsideBoxCommentInput'+commentId).value;
      document.querySelector('#InsideBoxCommentInput'+commentId).remove();
      let savedValue = createElement('p',{
        "id": "PcommentsPart"+commentId,
        "textContent": updatedContent
      });
      document.querySelector('#commentsPart'+commentId).append(savedValue);
      window.removeEventListener('click',outerClickDetector);
    }
  }

}

function replyComment(commentId){
  reply = {"comment_id":9,"content":"replied comment"};
  replyDiv = createDiv(reply);
  
  var list = document.getElementById('overallComment'+commentId);
  list.append(replyDiv);
  console.log(reply.comment_id,'commentIds');
  document.getElementById('overallComment'+reply.comment_id).scrollIntoView(true);

}

function deleteComment(commentId){
  if(!confirm("Are you sure to delete this comment?")){
    return;
  }
  comments.map((comment)=>{
    const iterateToDelete = (commentObj)=>{
      if(commentObj.hasOwnProperty("child")){
        if(commentObj.comment_id == commentId){
          delete commentObj.comment_id;
          delete commentObj.content;
          delete commentObj.child;
        }
        if(commentObj.hasOwnProperty('child')){
          iterateToDelete(commentObj.child[0]);
        }
      }
      else{
        if(commentObj.comment_id == commentId){
          delete commentObj.comment_id;
          delete commentObj.content;
          delete commentObj.child;
        }
      }
    }
    iterateToDelete(comment);
    return comment;
  });
  loadComments();
}

function loadComments(){
    clearDiv();
    let app = document.querySelector('#commentsView');
    let allComments = comments.map(
        comment=>{
          let divParentElement = createElement('div',{
            "id": 'ParentDiv'+comment.comment_id,
            "class": ["ParentDiv"],
            "name": "ParentDiv"
          });
          const hasProperChild = comment?.comment_id;
          if(hasProperChild == undefined){
            return;
          }
          let createdDiv = createDiv(comment);
          divParentElement.append(createdDiv);

          const iterateThroughChild = (comment,ParentDivs)=>{
            if(!comment.hasOwnProperty('child')){
              return;
            }
            const hasProperChild = comment?.child[0]?.comment_id;
            if(hasProperChild != undefined){
              childAppended = createDiv(comment.child[0]);
              if(typeof ParentDivs == 'object'){
                ParentDivs.appendChild(childAppended);
              }
              else{
                createdDiv.appendChild(childAppended);
              }
              createdDiv.append(ParentDivs);
              iterateThroughChild(comment.child[0],childAppended);
            }
          }
          iterateThroughChild(comment,"");
          return divParentElement;
        }
    ).filter(Boolean);
    app.append(...allComments);
}

function clearDiv(){
    document.getElementById('myForm').reset();
    document.querySelectorAll('.overallComment').forEach(el => el.remove());
}

function createDiv(comment){
    let divElement = createElement('div',{
      "id": "overallComment"+comment.comment_id,
      "class": ["overallComment"],
      "name": "overallComment"
    });

    let commentsPartElement = createElement('div',{
      "id": "commentsPart"+comment.comment_id,
      "class": ["commentsPart"],
      "name": "commentsPart"
    });

    divElement.append(commentsPartElement);

    let nameElement = createElement('b',{
      "textContent": "Vimaldarsan",
    });

    commentsPartElement.append(nameElement);

    let pElement = createElement('p',{
      "id": "PcommentsPart"+comment.comment_id,
      "textContent": comment.content
    });

    commentsPartElement.appendChild(pElement);

    let actionElement = createElement('div',{
      "id": 'commentAction'+comment.comment_id,
      "class": ["actionPart"],
      "name": "actionPart"
    });

    divElement.append(actionElement);

    actionElement.innerHTML += `<a class="blueLink" id="reply" onclick="replyComment(`+comment.comment_id+`)">Reply</a> <span class="blueLink">|</span>
    <a class="blueLink" id="edit" onclick="editComment(`+comment.comment_id+`)">Edit</a> <span class="blueLink">|</span>
    <a class="blueLink" id="delete" onclick="deleteComment(`+comment.comment_id+`)">Delete</a>`;
    count++;

    return divElement;
}

function createElement(type, attributes) {
  var element = document.createElement(type);
  for (var key in attributes) {
    if (key == "class") {
        element.classList.add.apply(element.classList, attributes[key]); // add all classes at once
    } else {
      element[key] = attributes[key];
    }
  }
  return element;
}