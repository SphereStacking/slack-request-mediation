
function handleViewSubmission(payload){
  const actionId = payload.view.callback_id
  logInfo('handleViewSubmission:' + actionId)
  switch(actionId){
    case VIEW_SUBMISSION_ACTION_ID.TASK_ADD:
      addTask(payload)
      break
  }
}

/**
 * 依頼を登録する
 * @param {Object} payload - ペイロード
 */
function addTask(payload){
  const user_id = payload.user.id 
  logInfo('addTask')
  const values = extractValuesFromState(payload.view.state)
  logInfo(values)

  // 投稿先のチャンネル
  const channelMessage = postChannelMessage(
    values.post_channel,
    { 
      blocks: makeNewTaskDetailBlock({
        summary:values.summary,
        detail:values.detail,
        assignee:values.assignee,
        due_date:values.due_date,
        priority:values.priority,
        requester:values.requester
      })
    }
  );
  // 依頼元ユーザーに通知
  const response = getPermalink(channelMessage.channel,channelMessage.ts)
  postDirectMessage(
    user_id,
    { text: `依頼を完了しました。\n${JSON.stringify(values)} \n${ response.permalink }`,}
  );
  addRowRequestTask(values,user_id)
}
