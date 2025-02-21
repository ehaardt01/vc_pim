function launchWorkflow(workflowId, recordId, workflowType, workflowParameters) {
	return initiate_workflow(
		workflowId,
		{
			"id": recordId,
			"type": workflowType
		},
		workflowParameters
	);
}

/* PARAMETERS */

const WORKFLOW_TYPE = 'product';
const WORKFLOW_ID = 's-83c59719-1586-4ec3-8159-a9e74fa13bbe';
const RECORD_ID = context.entity.external_id;
const PARAMETERS = {
	"locale": flow.locale
};

/* MAIN */

var obj = launchWorkflow(
	WORKFLOW_ID,
	RECORD_ID,
	WORKFLOW_TYPE,
	PARAMETERS
);
