import api from "./api";

const uploadResume = (file) => {
    let formData = new FormData();
    formData.append("file", file);

    return api.post("/resumes/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getResumes = () => {
    return api.get("/resumes");
};

const updateResume = (id, data) => {
    return api.put(`/resumes/${id}`, data);
};

const ResumeService = {
    uploadResume,
    getResumes,
    updateResume,
};

export default ResumeService;
