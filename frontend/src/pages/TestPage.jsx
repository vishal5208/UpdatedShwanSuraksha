import React, { useState } from "react";
import { Web3Storage } from "web3.storage";

const token = process.env.REACT_APP_WEB3_TOKEN;

const TestPage = () => {
	const [files, setFiles] = useState([]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const client = new Web3Storage({ token });
		const cid = await client.put(files);
	};

	return (
		<div className="container mx-auto py-8">
			<header className="text-center">
				<h1 className="text-4xl font-bold">Web3.storage</h1>
			</header>
			<form
				id="upload-form"
				className="max-w-lg mx-auto mt-8"
				onSubmit={handleSubmit}
			>
				<label htmlFor="filepicker" className="text-black">
					Pick files to store
				</label>
				<input
					type="file"
					id="filepicker"
					name="fileList"
					className="block mb-4"
					onChange={(e) => setFiles(e.target.files)}
					multiple
					required
				/>

				<div className="sm:col-start-2 sm:col-span-2 ">
					<button
						type="submit"
						className="text-white w-1/3 sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 sm:w-full"
					>
						SUBMIT
					</button>
				</div>
			</form>
		</div>
	);
};

export default TestPage;
