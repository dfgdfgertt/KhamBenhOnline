const express = require('express');
const Growth = require('./../fp-growth/examples/example');
const Diagnostic = require('./../database/table/diagnostic');
const Symptom = require('./../database/table/symptom');
const Faculty = require('./../database/table/faculty');
const Member = require('./../database/table/member');
const {Classifier} = require('ml-classify-text');


const createsymptom = async function (req, res) {
    await Growth.exe(req.body);
    res.status(200).json({"message":"Thực thi thành công."});
    return;
    // await delay(5000);
    // Diagnostic.find((err, diagnostics)=>{
    //     if (err) {
    //         res.status(400).send({"message":"Thực thi không thành công."});
    //         console.log(err);
    //         return;
    //     }else{
    //         Symptom.findOne(function (err, symptom) {
    //             if (err) {
    //                 res.status(400).send({"message":"Thực thi không thành công."});
    //                 console.log(err);
    //                 return;
    //             }else{
    //                 symptom.symptom = diagnostics;
    //                 symptom.save().then(symp=>{
    //                     res.status(200).json({"message":"Thực thi thành công."});
    //                     return;
    //                 }).catch(err =>{
    //                     res.status(400).send({"message":"Thực thi không thành công."});
    //                     console.log(err);
    //                     return;
    //                 })
    //             }
    //         })
           
    //     }
    // })
}

const createByAdmin = function (req, res) {
    if (!req.body.symptom) {
        res.status(400).send({"message":"Hãy nhập vào các triệu chứng đặc biệt."});
        console.log(err);
        return
    }
    if (!req.body.name) {
        res.status(400).send({"message":"Hãy nhập vào tên chuẩn đoán của các triệu chứng đặc biệt."});
        console.log(err);
        return
    }
    if (!req.body.idFaculty) {
        res.status(400).send({"message":"Hãy chọn khoa của triệu chứng."});
        console.log(err);
        return
    }
    Diagnostic.findOne({symptom: req.body.symptom}, function(err, diag){
        if (err) {
            res.status(400).send({"message":"Có gì đó không đúng."});
            console.log(err);
            return
        } else {
            if (diag) {
                res.status(400).send({"message":"Đã tồn tại danh sách triệu chứng này."});
                console.log(err);
                return
            } else {
                let diagnostic = new Diagnostic(req.body);
                diagnostic
                    .save()
                    .then(diag =>{
                        res.status(200).send({"message":"Thêm chuẩn đoán thành công."});
                        return
                    })
                    .catch(err =>{
                        res.status(400).send({"message":"Thêm chuẩn đoán không thành công."});
                        console.log(err);
                        return
                    })
            }
        }
    });
}

const getAll = function (req, res) {
    Diagnostic.find( function(err , diagnostics){
        if (err) {
            res.status(400).send({"message":"data is not found"});
            console.log(err);
        } else {
            res.status(200).json(diagnostics);
        }
    }).populate('idFaculty');
}

const getOneById = function (req, res) {
    let id = req.params.id;
    Diagnostic.findById(id, function (err, diagnostic){
        if (!diagnostic){
            res.status(400).send({"message":"data is not found"});
            console.log(err);
        }
        else {
            res.status(200).json(diagnostic);
        }
    }).populate('idFaculty');
}

const updateById = function (req, res) {
    Diagnostic.findById(req.params.id, async function(err, diagnostic) {
        if (!diagnostic){
            res.status(400).send({"message":"data is not found"});
            console.log(err);
            return;
        }
        else {
            Faculty.findById(req.body.idFaculty,async (err, faculty)=>{
                if (err) {
                    res.status(400).send({"message":"faculty is not found"});
                    console.log(err);
                    return;
                } else {
                    diagnostic.idFaculty = faculty._id ;
                    diagnostic.name = req.body.name;
                    diagnostic.description = req.body.description;
                    diagnostic.save()
                    .then(business => {
                        console.log(business);
                        res.status(200).json({"message":"Update complete"});
                        return;
                    }).catch(err => {
                        res.status(400).send({"message":"unable to update the database"});
                        console.log(err);
                        return;
                    });
                }
            })
        }
    });
}

const deleteById = function (req, res) {
    Diagnostic.findByIdAndRemove({_id: req.params.id}, function(err, e){
        if(err){
            res.status(400).json({"message":"Data is not found"});
            console.log(err);
            return;
        } 
        else res.status(200).json({"message":"Successfully removed"});
    });
}

const searchDiagnostic = function (req, res) {
 
    const classifier = new Classifier();
    Diagnostic.find(function(err , diagnostics){
        diagnostics.forEach(diagnostic => {
            classifier.train(diagnostic.symptom, diagnostic._id.toString());
        });
        let predictions = classifier.predict(req.body.symptom);
        if (predictions.length) {
            predictions.forEach(prediction => {
                //console.log(`${prediction.label} (${prediction.confidence})`)
                Diagnostic.findById(prediction.label, (err , diagnostic)=>{
                    if (err) {
                        res.status(400).json({"message":"Data is not found"});
                        console.log(err);
                    } else {
                        if (req.body.idMember) {
                            Member.findById(req.body.idMember, (err, u)=>{
                                u.listDiagnostic.push(diagnostic._id);
                                u.save();
                            })
                        }
                        Member.findById(req.body.idMember, function (err, member) {
                            if (member) {
                                member.listDiagnostic.push(diagnostic);
                                member.save()
                            }
                        })
                        res.status(200).json(diagnostic);
                        return;
                    }
                }).populate('idFaculty');
            })
        } else {
            res.status(200).json({"message":"Hãy nhập rõ hơn triệu chứng của bạn!"});
            console.log(err);
            return;
        }
    }).populate('idFaculty');
};


module.exports = {
    createsymptom,
    getAll,
    getOneById,
    updateById,
    deleteById,
    searchDiagnostic,
    createByAdmin
};