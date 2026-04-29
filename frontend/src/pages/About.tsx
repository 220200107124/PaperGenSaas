// import React from 'react';
import { GraduationCap, Users, Target, Award } from "lucide-react";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
        <Navbar></Navbar>
      {/* Hero */}
      <section className="text-center py-16 sm:py-20 px-4">
        <button className=" absolute left-2 top-22 sm:top-30 sm:left-10 bg-blue-800 rounded-lg w-20 h-10 text-gray-50"><a href="/">&lt;- Back</a></button>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900">
          About PaperGen
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-500 text-base sm:text-lg">
          We are on a mission to simplify exam paper creation for Gujarati
          Medium schools, making it faster, smarter, and more standardized.
        </p>
      </section>

      {/* Mission / Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border  border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Our Mission
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            To eliminate manual effort in exam creation and empower teachers
            with a fast, reliable, and standardized system for generating
            question papers.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Award className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Our Vision
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            To become the leading digital infrastructure for schools across
            Gujarat, standardizing academic workflows and improving educational
            quality.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">
          What We Do
        </h2>

        <p className="max-w-3xl mx-auto text-gray-500 leading-relaxed">
          PaperGen provides a powerful platform for teachers and schools to
          create, manage, and generate professional exam papers in minutes. With
          a structured question bank aligned to GSEB standards, we ensure
          consistency, quality, and efficiency in every paper created.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <GraduationCap className="mx-auto text-blue-600 mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">500+</h3>
          <p className="text-xs text-gray-500 uppercase">Schools</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Users className="mx-auto text-green-600 mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">2,500+</h3>
          <p className="text-xs text-gray-500 uppercase">Teachers</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Award className="mx-auto text-orange-600 mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">50,000+</h3>
          <p className="text-xs text-gray-500 uppercase">Questions</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Target className="mx-auto text-purple-600 mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
          <p className="text-xs text-gray-500 uppercase">Papers Generated</p>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-10">
          Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <img
                src={`https://i.pravatar.cc/150?u=${i}`}
                alt="team"
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h4 className="font-semibold text-gray-900">Team Member {i}</h4>
              <p className="text-sm text-gray-500">Role / Position</p>
            </div>
          ))}
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default AboutPage;
