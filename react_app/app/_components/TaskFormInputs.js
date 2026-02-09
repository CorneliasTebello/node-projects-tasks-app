import StatusSelect from '@components/StatusSelect.js';

export default function TaskFormInputs({ task_id, name, description, status, date_created, date_updated}){


  return (
	  <>
		<input type="hidden" name="task_id" value={task_id} />

		<div className="mb-3 row">
			<label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
			<div className="col-sm-10">
				  <input
					className="form-control"
					id="inputName"
					type="text"
					name="name"
					defaultValue={name}
				  />
			</div>
		</div>

		<div className="mb-3 row">
			<label htmlFor="inputDescription" className="col-sm-2 col-form-label">Description</label>
			<div className="col-sm-10">
				  <textarea name="description" defaultValue={description} className="form-control"></textarea>
			</div>
		</div>

		<div className="mb-3 row">
			<label htmlFor="inputDescription" className="col-sm-2 col-form-label">Status</label>
			<div className="col-sm-10">
				<StatusSelect name="status" value={status} classNames="form-select" />
			</div>
		</div>
		
	</>
  );
}