const express = require('express');
const Growth = require('./../fp-growth/examples/example');
const Diagnostic = require('./../database/table/diagnostic');
const Symptom = require('./../database/table/symptom');
const Faculty = require('./../database/table/faculty');
const Member = require('./../database/table/member');
const {Classifier} = require('ml-classify-text');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

const createsymptom = async function (req, res) {
    await Growth.exe();
    await delay(10000);
    Diagnostic.find((err, diagnostics)=>{
        if (err) {
            res.status(400).send({"message":"unable to save to database"});
            console.log(err);
        }else{
            let symptom = new Symptom();
            diagnostics.forEach(element => {
                symptom.symptom.push(element.symptom);
            });
            symptom.save().then(symp=>{
                res.status(200).json({"message":"Execute successfully"});
            }).catch(err =>{
                res.status(400).send({"message":"unable to save to database"});
                console.log(err);
            })
        }
    })
}

const getAll = function (req, res) {
    Diagnostic.find( function(err , diagnostics){
        if (err) {
            res.status(404).send({"message":"data is not found"});
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
            res.status(404).send({"message":"data is not found"});
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
            res.status(404).send({"message":"data is not found"});
            console.log(err);
            return;
        }
        else {
            Faculty.findById(req.body.idFaculty,async (err, faculty)=>{
                if (err) {
                    res.status(404).send({"message":"faculty is not found"});
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
            res.status(404).json({"message":"Data is not found"});
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
                        res.status(200).json(diagnostic);
                    }
                }).populate('idFaculty');
            })
        } else {
            res.status(200).json({"message":"Hãy nhập rõ hơn triệu chứng của bạn!"});
            console.log(err);
        }
    }).populate('idFaculty');
};


module.exports = {
    createsymptom,
    getAll,
    getOneById,
    updateById,
    deleteById,
    searchDiagnostic
};