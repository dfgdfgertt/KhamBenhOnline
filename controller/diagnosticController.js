const express = require('express');
const Growth = require('./../fp-growth/examples/example');
const Diagnostic = require('./../database/table/diagnostic');
const Symptom = require('./../database/table/symptom');
const Faculty = require('./../database/table/faculty');

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
    })
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
    });
}

const updateById = function (req, res) {
    KhDiagnosticoa.findById(req.params.id, async function(err, diagnostic) {
        if (!diagnostic){
            res.status(404).send({"message":"data is not found"});
            console.log(err);
        }
        else {
            Faculty.findById(req.body.idFaculty, (err, faculty)=>{
                if (err) {
                    res.status(404).send({"message":"faculty is not found"});
                    console.log(err);
                } else {
                    diagnostic.idFaculty = req.body.idFaculty;
                }
            });
            diagnostic.name = req.body.name;
            diagnostic.description = req.body.description;
            diagnostic.save().then(business => {
                res.status(200).json({"message":"Update complete"});
            })
            .catch(err => {
                res.status(400).send({"message":"unable to update the database"});
                console.log(err);
            });
        }
    });
}


const deleteById = function (req, res) {
    Diagnostic.findByIdAndRemove({_id: req.params.id}, function(err, e){
        if(err){
            res.status(400).json({"message":"Data is not found"});
            console.log(err);
        } 
        else res.status(200).json({"message":"Successfully removed"});
    });
}



module.exports = {
    createsymptom,
    getAll,
    getOneById,
    updateById,
    deleteById,
};